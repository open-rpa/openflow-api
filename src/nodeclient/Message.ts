import { WebSocketClient } from '../WebSocketClient';
import { Base } from './Base';
import { NoderedUtil } from './NoderedUtil';
import { ApiConfig } from '../ApiConfig';
import { QueuedMessage } from '../Message/QueuedMessage';
import { SocketMessage } from '../Message/SocketMessage';
import { TokenUser } from './TokenUser';
import { SigninMessage } from '../Message/SigninMessage';
import { QueryMessage } from '../Message/QueryMessage';
import { QueueMessage } from '../Message/QueueMessage';
import { WatchEventMessage } from '../Message/WatchEventMessage';

function isNumber(value: string | number): boolean {
    return value != null && !isNaN(Number(value.toString()));
}








export class Message {
    public id: string;
    public replyto: string;
    public command: string;
    public data: string;
    public static frommessage(msg: SocketMessage, data: string): Message {
        const result: Message = new Message();
        result.id = msg.id;
        result.replyto = msg.replyto;
        result.command = msg.command;
        result.data = data;
        return result;
    }

    public Process(cli: WebSocketClient): void {
        try {
            let command: string = '';
            if (this.command !== null && this.command !== undefined) {
                command = this.command.toLowerCase();
            }
            if (this.command !== 'ping' && this.command !== 'pong') {
                if (this.replyto !== null && this.replyto !== undefined) {
                    const qmsg: QueuedMessage = cli.messageQueue[this.replyto];
                    if (qmsg !== undefined && qmsg !== null) {
                        if (ApiConfig.log_trafic_verbose) cli._logger.verbose('[RESC][' + this.command + '][' + this.id + '][' + this.replyto + '][CB]');
                        if (ApiConfig.log_trafic_silly) cli._logger.silly('[RESC][' + this.command + '][' + this.id + '][' + this.replyto + '][CB]');
                        qmsg.message = Object.assign(qmsg.message, JSON.parse(this.data));
                        if (qmsg.cb !== undefined && qmsg.cb !== null) {
                            qmsg.cb(qmsg.message);
                        }
                        delete cli.messageQueue[this.id];
                    } else {
                        if (ApiConfig.log_trafic_verbose) cli._logger.verbose('[RESC][' + this.command + '][' + this.id + '][' + this.replyto + '][NO CB!]');
                        if (ApiConfig.log_trafic_silly) cli._logger.silly('[RESC][' + this.command + '][' + this.id + '][' + this.replyto + '][NO CB!]');
                    }
                    return;
                } else {
                    if (ApiConfig.log_trafic_verbose) cli._logger.verbose('[RESC][' + this.command + '][' + this.id + '][' + this.replyto + ']');
                    if (ApiConfig.log_trafic_silly) cli._logger.silly('[RESC][' + this.command + '][' + this.id + '][' + this.replyto + ']');
                }
            }
            switch (command) {
                case 'ping':
                    this.Ping(cli);
                    break;
                case 'pong':
                    break;
                case 'signin':
                    this.Signin(cli);
                    break;
                case 'refreshtoken':
                    this.RefreshToken(cli);
                    break;
                case 'queuemessage':
                    this.QueueMessage(cli);
                    break;
                case 'watchevent':
                    this.Watch(cli)
                    break;
                default:
                    this.UnknownCommand(cli);
                    break;
            }
        } catch (error) {
            cli._logger.error(error);
        }
    }
    public async Send(cli: WebSocketClient): Promise<void> {
        try {
            await cli.Send(this);
        } catch (error) {
            throw error;
        }
    }
    private async UnknownCommand(cli: WebSocketClient): Promise<void> {
        this.Reply('error');
        this.data = 'Unknown command';
        try {
            await this.Send(cli);
        } catch (error) {
            throw error;
        }
    }
    private async Ping(cli: WebSocketClient): Promise<void> {
        this.Reply('pong');
        try {
            await this.Send(cli);
        } catch (error) {
            throw error;
        }
    }
    public Reply(command: string): void {
        this.command = command;
        this.replyto = this.id;
        this.id = Math.random().toString(36).substr(2, 9);
    }
    private Signin(cli: WebSocketClient): void {
        const msg: SigninMessage = SigninMessage.assign(this.data);
        cli.jwt = msg.jwt;
        cli.user = msg.user;
        const qmsg: QueuedMessage = cli.messageQueue[this.replyto];
        if (qmsg !== undefined && qmsg !== null) {
            if (qmsg.cb !== undefined && qmsg.cb !== null) {
                qmsg.cb(msg);
            }
            delete cli.messageQueue[this.id];
        }
    }
    private RefreshToken(cli: WebSocketClient): void {
        const msg: SigninMessage = SigninMessage.assign(this.data);
        cli.jwt = msg.jwt;
        cli.user = msg.user;
    }
    private Query(cli: WebSocketClient): void {
        const msg: QueryMessage = QueryMessage.assign(this.data);
        const qmsg: QueuedMessage = cli.messageQueue[this.replyto];
        if (qmsg !== undefined && qmsg !== null) {
            if (qmsg.cb !== undefined && qmsg.cb !== null) {
                qmsg.cb(msg);
            }
            delete cli.messageQueue[this.id];
        }
    }
    private async Watch(cli: WebSocketClient): Promise<void> {
        this.Reply(this.command);
        const msg: WatchEventMessage = WatchEventMessage.assign(this.data);
        if (!NoderedUtil.IsNullEmpty(msg.id)) {
            if (!NoderedUtil.IsNullUndefinded(NoderedUtil.watchcb[msg.id])) {
                try {
                    NoderedUtil.watchcb[msg.id](msg.result);
                } catch (error) {
                    cli._logger.error('Error calling watch event callback to ' + msg.id + ' ' + JSON.stringify(error));
                }
            }
        }
        try {
            await this.Send(cli);
        } catch (error) {
            throw error;
        }
    }

    private async QueueMessage(cli: WebSocketClient): Promise<void> {
        this.Reply(this.command);
        let handled: boolean = false;
        const msg: QueueMessage = QueueMessage.assign(this.data);

        if (!NoderedUtil.IsNullEmpty(msg.queuename)) {
            if (NoderedUtil.messageQueuecb[msg.queuename] != null) {
                NoderedUtil.messageQueuecb[msg.queuename](msg, async (nack: boolean, result: any) => {
                    if (nack === false) {
                        this.Reply('error');
                        this.data = 'nack message';
                        if (typeof result === 'string' || result instanceof String) {
                            this.data = result as any;
                        }
                    } else {
                        if (result != null && !NoderedUtil.IsNullEmpty(msg.replyto) && this.command !== 'error') {
                            try {
                                await NoderedUtil.QueueMessage(
                                    cli,
                                    msg.replyto,
                                    '',
                                    result,
                                    msg.correlationId,
                                    ApiConfig.amqpReplyExpiration,
                                );
                            } catch (error) {
                                cli._logger.error('Error sending response to ' + msg.replyto + ' ' + JSON.stringify(error));
                            }
                        }
                    }
                    try {
                        await this.Send(cli);
                    } catch (error) {
                        throw error;
                    }
                });
                handled = true;
            }
        }
    }
}

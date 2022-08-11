import { WebSocketClient } from "..";
import { TokenUser } from "../nodeclient/TokenUser";
export type QueueOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    exchangename?: string,
    routingkey?: string,
    queuename?: string,
    replyto?: string,
    data: any,
    correlationId?: string,
    expiration?: number,
    striptoken?: boolean
}
export class QueueDefaults {
    public priority: number = 2;
    public routingkey: string = "";
    public exchangename: string = "";
    public queuename: string = "";
    public replyto: string = "";
    public striptoken: boolean = false;
}
export class QueueMessage {
    public static parse(options: QueueOptions): [QueueMessage, number, WebSocketClient] {
        const defaults = new QueueDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: QueueMessage = Object.assign(defaults, options) as any;
        if (!q.correlationId || q.correlationId == "") q.correlationId = Math.random().toString(36).substr(2, 9);
        delete (q as any).websocket;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: any;
    public user: TokenUser;
    public striptoken: boolean;

    public correlationId: string;
    public replyto: string;
    public queuename: string;
    public data: any;
    public expiration: number;

    public consumerTag: string;
    public routingkey: string;
    public exchangename: string;
    static assign(o: any): QueueMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new QueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new QueueMessage(), o);
    }
}
import { WebSocketClient } from "..";
import { QueueClosed, QueueOnMessage } from "../nodeclient/NoderedUtil";

export type RegisterQueueOptions = {
    jwt?: string,
    priority?: number,
    queuename?: string,
    callback: QueueOnMessage,
    closedcallback: QueueClosed,
    websocket?: WebSocketClient
}
export class RegisterQueueDefaults {
    public priority: number = 2;
}
export class RegisterQueueMessage {
    public static parse(options: RegisterQueueOptions): [RegisterQueueMessage, number, WebSocketClient, QueueOnMessage, QueueClosed] {
        const defaults = new RegisterQueueDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const callback = (options.callback ? options.callback : undefined);
        const closedcallback = (options.closedcallback ? options.closedcallback : undefined);
        const q: RegisterQueueMessage = Object.assign(defaults, options) as any;
        delete (q as any).callback;
        delete (q as any).closedcallback;
        delete (q as any).websocket;
        return [q, priority, websocket, callback, closedcallback];
    }
    public error: string;
    public jwt: any;

    public queuename: string;
    static assign(o: any): RegisterQueueMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new RegisterQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new RegisterQueueMessage(), o);
    }
}
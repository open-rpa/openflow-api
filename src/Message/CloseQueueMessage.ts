import { WebSocketClient } from "..";
export type CloseQueueOptions = {
    jwt?: string,
    priority?: number,
    queuename: string,
    websocket?: WebSocketClient
}
export class CloseQueueDefaults {
    public priority: number = 2;
}
export class CloseQueueMessage {
    public static parse(options: CloseQueueOptions): [CloseQueueMessage, number, WebSocketClient] {
        const defaults = new CloseQueueDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: CloseQueueMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: any;

    public queuename: string;
    static assign(o: any): CloseQueueMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new CloseQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new CloseQueueMessage(), o);
    }
}

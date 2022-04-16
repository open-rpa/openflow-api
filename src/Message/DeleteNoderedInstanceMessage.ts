import { WebSocketClient } from "..";
export type DeleteNoderedInstanceOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id: string
}
export class DeleteNoderedInstanceDefaults {
    public priority: number = 2;
}
export class DeleteNoderedInstanceMessage {
    public static parse(options: DeleteNoderedInstanceOptions): [DeleteNoderedInstanceMessage, number, WebSocketClient] {
        const defaults = new DeleteNoderedInstanceDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: DeleteNoderedInstanceMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: any;
    public _id: string;
    static assign(o: any): DeleteNoderedInstanceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new DeleteNoderedInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteNoderedInstanceMessage(), o);
    }
}

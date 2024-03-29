import { WebSocketClient } from "..";
export type RestartNoderedInstanceOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id: string,
    traceId?: string,
    spanId?: string,
}
export class RestartNoderedInstanceDefaults {
    public priority: number = 2;
}
export class RestartNoderedInstanceMessage {
    public static parse(options: RestartNoderedInstanceOptions): [RestartNoderedInstanceMessage, number, WebSocketClient, string, string] {
        const defaults = new RestartNoderedInstanceDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: RestartNoderedInstanceMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: any;
    public _id: string;
    static assign(o: any): RestartNoderedInstanceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new RestartNoderedInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new RestartNoderedInstanceMessage(), o);
    }
}

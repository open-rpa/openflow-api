import { WebSocketClient } from "..";
export type StartNoderedInstanceOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id: string,
    traceId?: string,
    spanId?: string,
}
export class StartNoderedInstanceDefaults {
    public priority: number = 2;
}
export class StartNoderedInstanceMessage {
    public static parse(options: StartNoderedInstanceOptions): [StartNoderedInstanceMessage, number, WebSocketClient, string, string] {
        const defaults = new StartNoderedInstanceDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: StartNoderedInstanceMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: any;
    public _id: string;
    static assign(o: any): StartNoderedInstanceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StartNoderedInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StartNoderedInstanceMessage(), o);
    }
}

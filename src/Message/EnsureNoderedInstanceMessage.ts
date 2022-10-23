import { WebSocketClient } from "..";
export type EnsureNoderedInstanceOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id?: string
    skipcreate?: boolean,
    traceId?: string,
    spanId?: string,
}
export class EnsureNoderedInstanceDefaults {
    public priority: number = 2;
    public skipcreate: boolean = false;
}
export class EnsureNoderedInstanceMessage {
    public static parse(options: EnsureNoderedInstanceOptions): [EnsureNoderedInstanceMessage, number, WebSocketClient, string, string] {
        const defaults = new EnsureNoderedInstanceDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: EnsureNoderedInstanceMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: any;
    public _id: string;
    public skipcreate: boolean;
    static assign(o: any): EnsureNoderedInstanceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new EnsureNoderedInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new EnsureNoderedInstanceMessage(), o);
    }
}

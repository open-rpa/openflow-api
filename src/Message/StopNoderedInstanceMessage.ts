import { WebSocketClient } from "..";
export type StopNoderedInstanceOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id: string,
    traceId?: string,
    spanId?: string,
}
export class StopNoderedInstanceDefaults {
    public priority: number = 2;
}
export class StopNoderedInstanceMessage {
    public static parse(options: StopNoderedInstanceOptions): [StopNoderedInstanceMessage, number, WebSocketClient, string, string] {
        const defaults = new StopNoderedInstanceDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: StopNoderedInstanceMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: any;
    public name: string;
    public _id: string;
    static assign(o: any): StopNoderedInstanceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StopNoderedInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StopNoderedInstanceMessage(), o);
    }
}

import { WebSocketClient } from "..";
export type CountOptions = {
    priority?: number,
    jwt?: string,
    websocket?: WebSocketClient,
    collectionname: string,
    query: any,
    queryas?: string,
    traceId?: string,
    spanId?: string,
}
export class CountDefaults {
    public priority: number = 2;
}
export class CountMessage {
    public static parse(options: CountOptions): [CountMessage, number, WebSocketClient, string, string] {
        const defaults = new CountDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: CountMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public query: any;
    public collectionname: string;
    public result: number;
    public queryas: string;
    public static assign(o: any): CountMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new CountMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new CountMessage(), o);
    }
}
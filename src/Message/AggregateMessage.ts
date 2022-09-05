import { WebSocketClient } from "..";
export type AggregateOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    aggregates: object[],
    hint?: object | string
}
export class AggregateDefaults {
    public priority: number = 2;
}
export class AggregateMessage {
    public static parse(options: AggregateOptions): [AggregateMessage, number, WebSocketClient] {
        const defaults = new AggregateDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: AggregateMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: string;

    public aggregates: object[];
    public collectionname: string;
    public hint: object | string;
    public result: any[];
    static assign(o: any): AggregateMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new AggregateMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new AggregateMessage(), o);
    }
}
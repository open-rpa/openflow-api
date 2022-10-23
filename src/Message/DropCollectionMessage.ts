import { WebSocketClient } from "..";
export type DropCollectionOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    traceId?: string,
    spanId?: string,
}
export class DropCollectionDefaults {
    public priority: number = 2;
    public includehist: boolean = false;
}
export class DropCollectionMessage {
    public static parse(options: DropCollectionOptions): [DropCollectionMessage, number, WebSocketClient, string, string] {
        const defaults = new DropCollectionDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: DropCollectionMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;
    public collectionname: string;
    static assign(o: any): DropCollectionMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new DropCollectionMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DropCollectionMessage(), o);
    }
}

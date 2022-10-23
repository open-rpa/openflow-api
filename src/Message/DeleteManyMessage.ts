import { WebSocketClient } from "..";
export type DeleteManyOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    ids?: string[];
    query?: any;
    recursive?: boolean,
    traceId?: string,
    spanId?: string,
}
export class DeleteManyDefaults {
    public priority: number = 2;
    public recursive: boolean = false;
}
export class DeleteManyMessage {
    public static parse(options: DeleteManyOptions): [DeleteManyMessage, number, WebSocketClient, string, string] {
        const defaults = new DeleteManyDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: DeleteManyMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;
    public recursive: boolean;

    public ids: string[];
    public query: any;
    // public failed: string[];
    // public affected: string[];
    public affectedrows: number;
    public collectionname: string;
    static assign(o: any): DeleteManyMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new DeleteManyMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteManyMessage(), o);
    }
}
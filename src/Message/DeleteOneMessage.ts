import { WebSocketClient } from "..";
export type DeleteOneOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    id: string,
    recursive?: boolean,
    traceId?: string,
    spanId?: string,
}
export class DeleteOneDefaults {
    public priority: number = 2;
    public recursive: boolean = false;
}
export class DeleteOneMessage {
    public static parse(options: DeleteOneOptions): [DeleteOneMessage, number, WebSocketClient, string, string] {
        const defaults = new DeleteOneDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: DeleteOneMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;
    public recursive: boolean;

    public id: string;
    public collectionname: string;
    static assign(o: any): DeleteOneMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new DeleteOneMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteOneMessage(), o);
    }
}
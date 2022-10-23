import { WebSocketClient } from "..";
export type GetDocumentVersionOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    id: string,
    version: number,
    decrypt?: boolean,
    traceId?: string,
    spanId?: string,
}
export class GetDocumentVersionDefaults {
    public decrypt: boolean = true;
    public priority: number = 2;
}
export class GetDocumentVersionMessage {
    public static parse(options: GetDocumentVersionOptions): [GetDocumentVersionMessage, number, WebSocketClient, string, string] {
        const defaults = new GetDocumentVersionDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: GetDocumentVersionMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public id: string;
    public version: number;
    public collectionname: string;
    public decrypt: boolean;
    public result: any;
    static assign(o: any): GetDocumentVersionMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new GetDocumentVersionMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetDocumentVersionMessage(), o);
    }
}
import { WebSocketClient } from "..";
import { Base } from "..";
export type SaveFileOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    compressed?: boolean,
    filename: string,
    mimeType?: string,
    metadata?: any,
    file: string,
    traceId?: string,
    spanId?: string,
}
export class SaveFileDefaults {
    public priority: number = 2;
    public compressed: boolean = false;
}
export class SaveFileMessage {
    public static parse(options: SaveFileOptions): [SaveFileMessage, number, WebSocketClient, string, string] {
        const defaults = new SaveFileDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: SaveFileMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public compressed: boolean;
    public filename: string;
    public mimeType: string;
    public id: string;
    public metadata: any;
    public file: string;
    public result: Base;
    static assign(o: any): SaveFileMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new SaveFileMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new SaveFileMessage(), o);
    }
}
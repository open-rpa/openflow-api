import { WebSocketClient } from "..";
export type InsertOneOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    item: any,
    w?: number,
    j?: boolean,
}
export class InsertOneDefaults {
    public decrypt: boolean = true;
    public priority: number = 2;
    public w: number = 1;
    public j: boolean = true;
}
export class InsertOneMessage {
    public static parse(options: InsertOneOptions): [InsertOneMessage, number, WebSocketClient] {
        const defaults = new InsertOneDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: InsertOneMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: string;

    // w: 1 - Requests acknowledgment that the write operation has propagated
    // w: 0 - Requests no acknowledgment of the write operation
    // w: 2 would require acknowledgment from the primary and one of the secondaries
    // w: 3 would require acknowledgment from the primary and both secondaries
    public w: number;
    // true, requests acknowledgment that the mongod instances have written to the on-disk journal
    public j: boolean;
    public decrypt: boolean;
    public item: any;
    public collectionname: string;
    public result: any;
    static assign(o: any): InsertOneMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new InsertOneMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new InsertOneMessage(), o);
    }
}
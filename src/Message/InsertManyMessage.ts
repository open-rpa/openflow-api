import { WebSocketClient } from "..";
export type InsertManyOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    items: any[],
    w?: number,
    j?: boolean,
    skipresults: boolean,
    traceId?: string,
    spanId?: string,
}
export class InsertManyDefaults {
    public priority: number = 2;
    public w: number = 1;
    public j: boolean = true;
    public decrypt: boolean = true;
    public skipresults: boolean = false;
}
export class InsertManyMessage {
    public static parse(options: InsertManyOptions): [InsertManyMessage, number, WebSocketClient, string, string] {
        const defaults = new InsertManyDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: InsertManyMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
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
    public items: any[];
    public collectionname: string;
    public results: any[];
    public decrypt: boolean;
    public skipresults: boolean;
    static assign(o: any): InsertManyMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new InsertManyMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new InsertManyMessage(), o);
    }
}
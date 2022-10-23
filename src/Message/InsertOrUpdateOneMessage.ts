import { WebSocketClient } from "..";
import { Base } from "../nodeclient/Base";
export type InsertOrUpdateOneOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    uniqeness: string,
    item: any,
    w?: number,
    j?: boolean,
    traceId?: string,
    spanId?: string,
}
export class InsertOrUpdateOneDefaults {
    public priority: number = 2;
    public w: number = 1;
    public j: boolean = true;
}
export class InsertOrUpdateOneMessage {
    public static parse(options: InsertOrUpdateOneOptions): [InsertOrUpdateOneMessage, number, WebSocketClient, string, string] {
        const defaults = new InsertOrUpdateOneDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: InsertOrUpdateOneMessage = Object.assign(defaults, options) as any;
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
    public item: Base;
    public collectionname: string;
    public uniqeness: string;
    public result: any;
    public opresult: any;
    static assign(o: any): InsertOrUpdateOneMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new InsertOrUpdateOneMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new InsertOrUpdateOneMessage(), o);
    }
}
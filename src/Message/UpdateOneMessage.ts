import { WebSocketClient } from "..";
import { Base } from "../index";
export type UpdateOneOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    item?: any,
    query?: any,
    w?: number,
    j?: boolean
}
export class UpdateOneDefaults {
    public priority: number = 2;
    public w: number = 1;
    public j: boolean = true;
}
export class UpdateOneMessage {
    public static parse(options: UpdateOneOptions): [UpdateOneMessage, number, WebSocketClient] {
        const defaults = new UpdateOneDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: UpdateOneMessage = Object.assign(defaults, options) as any;
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
    public item: Base;
    public collectionname: string;
    public query: object;
    public result: any;
    public opresult: any;
    static assign(o: any): UpdateOneMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new UpdateOneMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new UpdateOneMessage(), o);
    }
}
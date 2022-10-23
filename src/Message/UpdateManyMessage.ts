import { Base } from "../nodeclient/Base";
export type UpdateManyOptions = {
    jwt?: string,
    priority?: number,
    collectionname: string,
    item?: any,
    query?: any,
    w?: number,
    j?: boolean,
    traceId?: string,
    spanId?: string,
}
export class UpdateManyDefaults {
    public priority: number = 2;
    public w: number = 1;
    public j: boolean = true;
}
export class UpdateManyMessage {
    public static parse(options: UpdateManyOptions): [UpdateManyMessage, number, string, string] {
        const defaults = new UpdateManyDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: UpdateManyMessage = Object.assign(defaults, options) as any;
        const { traceId, spanId } = options;
        return [q, priority, traceId, spanId];
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
    public query: object;
    public item: Base;
    public collectionname: string;
    public result: any[];
    public opresult: any;
    static assign(o: any): UpdateManyMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new UpdateManyMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new UpdateManyMessage(), o);
    }
}
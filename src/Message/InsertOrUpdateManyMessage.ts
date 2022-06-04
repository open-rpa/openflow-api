import { Base } from "../nodeclient/Base";
export type InsertOrUpdateManyOptions = {
    jwt?: string,
    priority?: number,
    collectionname: string,
    uniqeness: string,
    items: any[],
    w?: number,
    j?: boolean,
    skipresults: boolean
}
export class InsertOrUpdateManyDefaults {
    public priority: number = 2;
    public w: number = 1;
    public j: boolean = true;
    public skipresults: boolean = false;
}
export class InsertOrUpdateManyMessage {
    public static parse(options: InsertOrUpdateManyOptions): [InsertOrUpdateManyMessage, number] {
        const defaults = new InsertOrUpdateManyDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: InsertOrUpdateManyMessage = Object.assign(defaults, options) as any;
        return [q, priority];
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
    public items: Base[];
    public collectionname: string;
    public uniqeness: string;
    public results: any[];
    public skipresults: boolean;
    static assign(o: any): InsertOrUpdateManyMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new InsertOrUpdateManyMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new InsertOrUpdateManyMessage(), o);
    }
}
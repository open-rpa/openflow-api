export type QueryOptions = {
    priority?: number,
    jwt?: string,
    collectionname: string,
    query: any,
    projection?: Object,
    top?: number,
    skip?: number,
    orderby?: Object | string,
    queryas?: string,
    hint?: Object | string,
    decrypt?: boolean,
}
export class QueryDefaults {
    public priority: number = 2;
    public decrypt: boolean = true;
    public top: number = 100;
    public skip: number = 0;
}
export class QueryMessage {
    public static parse(options: QueryOptions): [QueryMessage, number] {
        const defaults = new QueryDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: QueryMessage = Object.assign(defaults, options) as any;
        return [q, priority];
    }
    public error: string;
    public jwt: string;

    public query: any;
    public projection: object;
    public top: number;
    public skip: number;
    public orderby: object | string;
    public collectionname: string;
    public result: any[];
    public queryas: string;
    public hint: object | string;
    public decrypt: boolean;
    public static assign(o: any): QueryMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new QueryMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new QueryMessage(), o);
    }
}
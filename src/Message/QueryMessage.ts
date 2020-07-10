export class QueryMessage {
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
    static assign(o: any): QueryMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new QueryMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new QueryMessage(), o);
    }
}
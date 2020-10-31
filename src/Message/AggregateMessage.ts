export class AggregateMessage {
    public error: string;
    public jwt: string;

    public aggregates: object[];
    public collectionname: string;
    public hint: object | string;
    public result: any[];
    static assign(o: any): AggregateMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new AggregateMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new AggregateMessage(), o);
    }
}
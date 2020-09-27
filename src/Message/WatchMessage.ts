export class WatchMessage {
    public error: string;
    public jwt: string;

    public id: string;
    public aggregates: object[];
    public collectionname: string;
    public result: any[];
    static assign(o: any): WatchMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new WatchMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new WatchMessage(), o);
    }
}

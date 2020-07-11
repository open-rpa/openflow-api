export class ListCollectionsMessage {
    public error: string;
    public jwt: string;
    public result: any;
    public includehist: boolean;
    static assign(o: any): ListCollectionsMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new ListCollectionsMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new ListCollectionsMessage(), o);
    }
}

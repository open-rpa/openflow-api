export class EnsureNoderedInstanceMessage {
    public error: string;
    public jwt: any;
    public _id: string;
    public skipcreate: boolean;
    public labels: any;
    static assign(o: any): EnsureNoderedInstanceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new EnsureNoderedInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new EnsureNoderedInstanceMessage(), o);
    }
}

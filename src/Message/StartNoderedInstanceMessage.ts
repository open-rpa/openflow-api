export class StartNoderedInstanceMessage {
    public error: string;
    public jwt: any;
    public name: string;
    public _id: string;
    static assign(o: any): StartNoderedInstanceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StartNoderedInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StartNoderedInstanceMessage(), o);
    }
}

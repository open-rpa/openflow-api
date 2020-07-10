export class StopNoderedInstanceMessage {
    public error: string;
    public jwt: any;
    public name: string;
    public _id: string;
    static assign(o: any): StopNoderedInstanceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StopNoderedInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StopNoderedInstanceMessage(), o);
    }
}

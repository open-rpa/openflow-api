export class RegisterExchangeMessage {
    public error: string;
    public jwt: any;

    public exchangename: string;
    public algorithm: "direct" | "fanout" | "topic" | "header";
    public routingkey: string = "";
    public queuename: string;
    public addqueue: string;
    static assign(o: any): RegisterExchangeMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new RegisterExchangeMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new RegisterExchangeMessage(), o);
    }
}
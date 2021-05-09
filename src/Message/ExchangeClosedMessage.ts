export class ExchangeClosedMessage {
    public error: string;
    public jwt: any;

    public exchangename: string;
    public algorithm: "direct" | "fanout" | "topic" | "header";
    public routingkey: string = "";
    public queuename: string;
    static assign(o: any): ExchangeClosedMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new ExchangeClosedMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new ExchangeClosedMessage(), o);
    }
}
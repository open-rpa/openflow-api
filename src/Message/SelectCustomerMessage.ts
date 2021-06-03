export class SelectCustomerMessage {
    public error: string;
    public jwt: string;

    public customerid: string;
    static assign(o: any): SelectCustomerMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new SelectCustomerMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new SelectCustomerMessage(), o);
    }
}
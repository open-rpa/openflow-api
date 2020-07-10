import { stripe_base } from "../stripe/stripe_base";

export class StripeMessage implements IReplyMessage {
    public error: string;
    public jwt: any;
    public method: string;
    public object: string;
    public id: string;
    public customerid: string;
    public url: string;
    public payload: stripe_base;

    static assign(o: any): StripeMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StripeMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StripeMessage(), o);
    }
}
import { Billing } from "../stripe/Billing";
import { stripe_customer } from "../stripe/stripe_customer";

export class EnsureStripeCustomerMessage implements IReplyMessage {
    public error: string;
    public jwt: string;

    public userid: string;
    public billing: Billing;
    public customer: stripe_customer;
    static assign(o: any): EnsureStripeCustomerMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new EnsureStripeCustomerMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new EnsureStripeCustomerMessage(), o);
    }
}
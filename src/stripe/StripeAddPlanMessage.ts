import { stripe_customer } from "./stripe_customer";

export class StripeAddPlanMessage implements IReplyMessage {
    public error: string;
    public jwt: string;

    public userid: string;
    public planid: string;
    public subplanid: string;
    public customer: stripe_customer;
    public checkout: any;
    static assign(o: any): StripeAddPlanMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StripeAddPlanMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StripeAddPlanMessage(), o);
    }
}

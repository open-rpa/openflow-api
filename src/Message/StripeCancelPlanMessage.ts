import { stripe_customer } from "../stripe/stripe_customer";

export class StripeCancelPlanMessage {
    public error: string;
    public jwt: string;

    public userid: string;
    public planid: string;
    public customer: stripe_customer;
    static assign(o: any): StripeCancelPlanMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StripeCancelPlanMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StripeCancelPlanMessage(), o);
    }
}

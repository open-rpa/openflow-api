import { stripe_customer } from "./stripe_customer";

export class StripeAddPlanMessage {
    public error: string;
    public jwt: string;

    public userid: string;
    public customerid: string;
    public resourceid: string;
    public stripeprice: string

    public stripecustomer: stripe_customer;
    public checkout: any;
    static assign(o: any): StripeAddPlanMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StripeAddPlanMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StripeAddPlanMessage(), o);
    }
}

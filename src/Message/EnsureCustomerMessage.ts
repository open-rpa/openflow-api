import { Billing } from "../stripe/Billing";
import { Customer } from "../nodeclient/Customer";
import { stripe_customer } from "../stripe/stripe_customer";

export class EnsureCustomerMessage {
    public error: string;
    public jwt: string;

    public userid: string;
    public billing: Billing;
    public customer: Customer;
    public stripecustomer: stripe_customer;
    static assign(o: any): EnsureCustomerMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new EnsureCustomerMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new EnsureCustomerMessage(), o);
    }
}
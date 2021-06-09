import { stripe_customer } from "../stripe/stripe_customer";
import { stripe_invoice } from "../stripe/stripe_invoice";

export class GetNextInvoiceMessage {
    public error: string;
    public jwt: string;


    public customerid: string;
    public subscriptionid: string;
    public subscription_items: subscription_item[];
    public proration_date: number;

    public invoice: stripe_invoice;
    static assign(o: any): GetNextInvoiceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new GetNextInvoiceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetNextInvoiceMessage(), o);
    }
}
export class subscription_item {
    public id?: string;
    public price?: string
    public quantity?: number;
}
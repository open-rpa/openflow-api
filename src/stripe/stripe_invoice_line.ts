import { stripe_base } from "./stripe_base";
import { stripe_period } from "./stripe_period";
import { stripe_plan } from "./stripe_plan";

// tslint:disable-next-line: class-name
export class stripe_invoice_line extends stripe_base {
    public amount: number;
    public currency: string;
    public description: string;
    public discountable: boolean;
    public period: stripe_period;
    public subplan: stripe_plan;
    public proration: boolean;
    public quantity: number;
    public type: string;
    // tslint:disable-next-line: variable-name
    public unique_id: string;
}
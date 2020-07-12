import { stripe_base } from "./stripe_base";
import { stripe_list } from "./stripe_list";
import { stripe_invoice_line } from "./stripe_invoice_line";

// tslint:disable-next-line: class-name
export class stripe_invoice extends stripe_base {
    // tslint:disable-next-line: variable-name
    public account_country: string;
    // tslint:disable-next-line: variable-name
    public account_name: string;
    // tslint:disable-next-line: variable-name
    public amount_due: number;
    // tslint:disable-next-line: variable-name
    public amount_paid: number;
    // tslint:disable-next-line: variable-name
    public amount_remaining: number;
    // tslint:disable-next-line: variable-name
    public application_fee_amount: number;
    // tslint:disable-next-line: variable-name
    public attempt_count: number;
    public attempted: boolean;
    public billing: string;
    // tslint:disable-next-line: variable-name
    public billing_reason: string;
    // tslint:disable-next-line: variable-name
    public collection_method: string;
    public currency: string;
    public customer: string;
    public lines: stripe_list<stripe_invoice_line>;
    // tslint:disable-next-line: variable-name
    public period_start: number;
    // tslint:disable-next-line: variable-name
    public period_end: number;
    // tslint:disable-next-line: variable-name
    public dtperiod_start: Date;
    // tslint:disable-next-line: variable-name
    public dtperiod_end: Date;
}
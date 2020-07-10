import { stripe_base } from "./stripe_base";
import { stripe_tax_verification } from "./stripe_tax_verification";

// tslint:disable-next-line: class-name
export class stripe_tax_id extends stripe_base {
    public country: string;
    public customer: string;
    public type: string;
    public value: string;
    public verification: stripe_tax_verification;
}

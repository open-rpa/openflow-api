import { stripe_base } from "./stripe_base";
// tslint:disable-next-line: class-name
export class stripe_coupon extends stripe_base {
    public duration: string;
    // tslint:disable-next-line: variable-name
    public duration_in_months: number;
    public name: string;
    // public duration: string;
}

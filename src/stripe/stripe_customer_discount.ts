import { stripe_base } from "./stripe_base";
import { stripe_coupon } from "./stripe_coupon";
// tslint:disable-next-line: class-name
export class stripe_customer_discount extends stripe_base {
    public subscription: string;
    public start: number;
    public customer: string;
    public coupon: stripe_coupon;
}

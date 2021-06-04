import { stripe_base } from "./stripe_base";
import { stripe_plan } from "./stripe_plan";
import { stripe_price } from "./stripe_price";

// tslint:disable-next-line: class-name
export class stripe_subscription_item extends stripe_base {
    public id: string;
    public quantity: number;
    public subscription: string;
    public plan: stripe_plan;
    public price: stripe_price;
}

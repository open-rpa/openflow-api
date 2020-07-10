import { stripe_base } from "./stripe_base";
import { stripe_list } from "./stripe_list";
import { stripe_tax_id } from "./stripe_tax_id";
import { stripe_subscription_item } from "./stripe_subscription_item";

// tslint:disable-next-line: class-name
export class stripe_subscription extends stripe_base {
    // public plan: stripe_plan;
    public address: string;
    public balance: number;
    public currency: string;
    public subscriptions: stripe_list<stripe_subscription>;
    // tslint:disable-next-line: variable-name
    public tax_ids: stripe_list<stripe_tax_id>;
    public items: stripe_list<stripe_subscription_item>;
}

import { stripe_base } from "./stripe_base";
import { stripe_list } from "./stripe_list";
import { stripe_tax_id } from "./stripe_tax_id";
import { stripe_subscription } from "./stripe_subscription";

// tslint:disable-next-line: class-name
export class stripe_customer extends stripe_base {
    public description: string;
    public name: string;
    public email: string;
    // tslint:disable-next-line: variable-name
    public tax_ids: stripe_list<stripe_tax_id>;
    public subscriptions: stripe_list<stripe_subscription>;
    // deprecated tax_info and tax_info_verification 
    // public tax_info: tax_info;
    // public tax_info_verification: tax_info_verification;
}

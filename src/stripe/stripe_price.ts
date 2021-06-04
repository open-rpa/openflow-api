import { stripe_base } from "./stripe_base";

// tslint:disable-next-line: class-name
export class stripe_price extends stripe_base {
    public nickname: string;
    public product: string;

    public active: boolean;
    public billing_scheme: string;
    public currency: string;
    public lookup_key: any;
    public recurring: stripe_recurring;
    public tiers_mode: any;
}
export class stripe_recurring {
    public aggregate_usage: any;
    public interval: string
    public interval_count: number;
    public trial_period_days: number;
    public usage_type: string;
}


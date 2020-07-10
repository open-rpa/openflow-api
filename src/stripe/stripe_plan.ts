import { stripe_base } from "./stripe_base";

// tslint:disable-next-line: class-name
export class stripe_plan extends stripe_base {
    public status: boolean;
    public nickname: string;
    public product: string;
    public amount: number;
}

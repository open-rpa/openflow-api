import { Base } from "./Base";

export class Resource extends Base {
    constructor() {
        super();
        this._type = 'resource';
    }
    public target: "customer" | "user" | "both";
    public customerassign: "singlevariant" | "multiplevariants";
    public userassign: "singlevariant" | "multiplevariants";
    public defaultmetadata: any;
    public products: ResourceVariant[];
}
export class ResourceVariant {
    public name: string;
    public stripeproduct: string;
    public stripeprice: string;
    public customerassign: "single" | "multiple" | "usage";
    public userassign: "single" | "multiple" | "usage";
    public added_stripeprice: string;
    public metadata: any;
}
export class ResourceUsage extends Base {
    constructor() {
        super();
        this._type = 'resourceusage';
    }
    public resource: ResourceVariant;
    public userid: string;
    public customerid: string;
    public quantity: number;
    /** "subscription" */
    public subid: string;
    "subscription"
    /** "subscription_item" */
    public siid: string;
}
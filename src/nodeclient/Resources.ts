import { Base } from "./Base";

export class Resource extends Base {
    constructor() {
        super();
        this._type = 'resource';
    }
    public target: "customer" | "user"; //  | "both"
    public customerassign: "singlevariant" | "multiplevariants";
    public userassign: "singlevariant" | "multiplevariants";
    public defaultmetadata: any;
    public products: ResourceVariant[];
    public allowdirectassign: boolean;
}
export class ResourceVariant {
    public name: string;
    public stripeproduct: string;
    public stripeprice: string;
    public customerassign: "single" | "multiple" | "metered";
    public userassign: "single" | "multiple" | "metered";
    public added_stripeprice: string;
    public added_resourceid: string;
    public added_quantity_multiplier: number;
    public metadata: any;
    public allowdirectassign: boolean;
}
export class ResourceUsage extends Base {
    constructor() {
        super();
        this._type = 'resourceusage';
    }
    public product: ResourceVariant;
    public resourceid: string;
    public resource: string;
    public userid: string;
    public customerid: string;
    public quantity: number;
    /** "subscription" */
    public subid: string;
    "subscription"
    /** "subscription_item" */
    public siid: string;
}
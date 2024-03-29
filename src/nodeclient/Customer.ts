import { Base } from "./Base";
export class Customer extends Base {
    public _id: string;
    public _type: string;
    public stripeid: string;
    public userid: string;
    public name: string;
    public country: string;
    public email: string;
    public address: string;
    public vattype: string;
    public vatnumber: string;
    public taxrate: string;
    public tax: number;
    public coupon: string;

    public hascard: boolean;
    public memory: string;
    public openflowuserplan: string;
    public supportplan: string;
    public supporthourplan: string;

    public subscriptionid: string;
    public admins: string;
    public users: string;
    public customattr1: string;
    public customattr2: string;
    public customattr3: string;
    public customattr4: string;
    public customattr5: string;
    public domains: string[];

    public dbusage: number = 0;
    public dblocked: boolean = false;

    constructor() {
        super();
        this.hascard = false;
        this._type = "customer";
        this.stripeid = "";
        this.userid = "";
        this.name = "";
        this.email = "";
        this.address = "";
        this.vattype = "";
        this.vatnumber = "";
        this.domains = [];
    }
}
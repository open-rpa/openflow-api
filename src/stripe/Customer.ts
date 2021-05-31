import { Base } from "../nodeclient/Base";
export class Customer extends Base {
    public _id: string;
    public _type: string;
    public stripeid: string;
    public userid: string;
    public name: string;
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

    constructor(userid) {
        super();
        this.hascard = false;
        this._type = "customer";
        this.stripeid = "";
        this.userid = userid;
        this.name = "";
        this.email = "";
        this.address = "";
        this.vattype = "";
        this.vatnumber = "";
    }
}
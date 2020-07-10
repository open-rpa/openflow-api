export class Billing {
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
    constructor(userid) {
        // super();
        this._type = "billing";
        this.stripeid = "";
        this.userid = userid;
        this.name = "";
        this.email = "";
        this.address = "";
        this.vattype = "";
        this.vatnumber = "";
    }
}
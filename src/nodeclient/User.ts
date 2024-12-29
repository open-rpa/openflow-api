import { Base } from "./Base";
import { FederationId } from "./FederationId";
import { Rolemember } from "./Rolemember";
export class User extends Base {
    constructor() {
        super();
        this._type = "user";
    }
    static assign<T>(o: any): T {
        const res = Object.assign(new User(), o);
        return res;
    }
    public noderedname: string;
    public lastseen: Date;
    public _heartbeat: Date;
    public _rpaheartbeat: Date;
    public _noderedheartbeat: Date;
    public _powershellheartbeat: Date;
    public _lastclientagent: string;
    public _lastclientversion: string;
    public _lastopenrpaclientversion: string;
    public _lastnoderedclientversion: string;
    public _lastpowershellclientversion: string;
    public _hasbilling: boolean;
    public username: string;
    public passwordhash: string;
    public sid: string;
    public customerid: string;
    public selectedcustomerid: string;
    public firebasetoken: string;
    public onesignalid: string;
    public gpslocation: any;
    public device: any;
    public impersonating: string;
    public federationids: FederationId[] = [];
    public roles: Rolemember[] = [];
    public role: string;
    public email: string;
    public company: string;
    public disabled: boolean;
    public validated: boolean;
    public emailvalidated: boolean;
    public formvalidated: boolean;
    public dbusage: number = 0;
    public dblocked: boolean = false;
    HasRoleName(name: string): boolean {
        const hits: Rolemember[] = this.roles.filter(member => member.name === name);
        return (hits.length === 1);
    }
    HasRoleId(id: string): boolean {
        const hits: Rolemember[] = this.roles.filter(member => member._id === id);
        return (hits.length === 1);
    }
}
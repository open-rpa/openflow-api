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
        if (res.nodered === null || res.nodered === undefined) {
            res.nodered = new User();
        }
        return res;
    }
    noderedname: string;
    lastseen: Date;
    _heartbeat: Date;
    _rpaheartbeat: Date;
    _noderedheartbeat: Date;
    _lastclientagent: string;
    _lastclientversion: string;
    _lastopenrpaclientversion: string;
    _lastnoderedclientversion: string;
    _hasbilling: boolean;
    username: string;
    passwordhash: string;
    sid: string;
    firebasetoken: string;
    onesignalid: string;
    gpslocation: any;
    device: any;
    impersonating: string;
    federationids: FederationId[] = [];
    roles: Rolemember[] = [];
    HasRoleName(name: string): boolean {
        const hits: Rolemember[] = this.roles.filter(member => member.name === name);
        return (hits.length === 1);
    }
    HasRoleId(id: string): boolean {
        const hits: Rolemember[] = this.roles.filter(member => member._id === id);
        return (hits.length === 1);
    }
}
import { Rolemember } from "./Rolemember";
import { User } from "./User";
import { NoderedUtil } from "./NoderedUtil";

export class TokenUser {
    public _type: string;
    public _id: string;
    public name: string;
    public username: string;
    public roles: Rolemember[] = [];
    public role: string;
    public email: string;
    public impostor: string;
    public disabled: boolean;
    public validated: boolean;
    public emailvalidated: boolean;
    public formvalidated: boolean;
    public customerid: string;
    public selectedcustomerid: string;
    public dblocked: boolean = false;

    static From(user: User | TokenUser): TokenUser {
        if (user === null || user === undefined) { return; }
        const result: TokenUser = new TokenUser();
        result._type = user._type;
        result._id = user._id;
        result.impostor = (user as TokenUser).impostor;
        result.name = user.name;
        result.username = user.username;
        result.roles = user.roles;
        result.disabled = user.disabled;
        result.email = user.email;
        result.role = user.role;
        result.validated = false;
        result.dblocked = user.dblocked;
        if (user.validated == true) result.validated = user.validated;
        if (user.emailvalidated == true) result.emailvalidated = user.emailvalidated;
        if (user.formvalidated == true) result.formvalidated = user.formvalidated;
        result.customerid = user.customerid;
        result.selectedcustomerid = user.selectedcustomerid;
        return result;
    }

    static assign<T>(o: T): T {
        const newo: TokenUser = new TokenUser();
        return Object.assign(newo, o);
    }
    HasRoleName(name: string): boolean {
        const hits: Rolemember[] = this.roles.filter(member => member.name === name);
        return (hits.length === 1);
    }
    HasRoleId(id: string): boolean {
        const hits: Rolemember[] = this.roles.filter(member => member._id === id);
        return (hits.length === 1);
    }
}

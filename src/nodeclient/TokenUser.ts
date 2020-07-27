import { Rolemember } from "./Rolemember";
import { User } from "./User";

export class TokenUser {
    public _type: string;
    public _id: string;
    public name: string;
    public username: string;
    public roles: Rolemember[] = [];
    public impostor: string;
    public disabled: boolean;

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

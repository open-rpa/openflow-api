import { Rolemember } from "./Rolemember";

export class TokenUser {
    _type: string;
    _id: string;
    name: string;
    username: string;
    roles: Rolemember[] = [];
    static assign<T>(o: T): T {
        const newo: TokenUser = new TokenUser();
        return Object.assign(newo, o);
    }
}

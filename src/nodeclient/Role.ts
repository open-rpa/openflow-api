import { Base } from "./Base";
import { Rolemember } from "./Rolemember";
export class Role extends Base {
    constructor(name: string, _id: string) {
        super();
        this.name = name;
        this._id = _id;
        this._type = 'role';
    }
    name: string;
    _id: string;
    members: Rolemember[];
}

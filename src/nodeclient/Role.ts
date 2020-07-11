import { Base } from "./Base";
import { Rolemember } from "./Rolemember";
export class Role extends Base {
    constructor() {
        super();
        this._type = 'role';
    }
    name: string;
    _id: string;
    members: Rolemember[];
    static assign<T>(o: any): T {
        const res = Object.assign(new Role(), o);
        if (res.nodered === null || res.nodered === undefined) {
            res.nodered = new Role();
        }
        return res;
    }
    IsMember(_id: string): boolean {
        const hits: Rolemember[] = this.members.filter(member => member._id === _id);
        return (hits.length === 1);
    }
    AddMember(item: Base): void {
        if (!this.IsMember(item._id)) {
            this.members.push(new Rolemember(item.name, item._id));
        }
    }
    RemoveMember(_id: string): void {
        this.members.forEach((member, idx) => {
            if (member._id === _id) {
                this.members.splice(idx, 1);
            }
        });
    }

}

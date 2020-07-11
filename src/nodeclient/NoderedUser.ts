import { NoderedConfig } from "./NoderedConfig";
import { User } from "./User";

export class NoderedUser extends User {
    public nodered: NoderedConfig;
    constructor() {
        super();
        this._type = "user";
    }
    static assign<T>(o: any): T {
        const res = Object.assign(new NoderedUser(), o);
        if (res.nodered === null || res.nodered === undefined) {
            res.nodered = new NoderedConfig();
        }
        return res;
    }

}

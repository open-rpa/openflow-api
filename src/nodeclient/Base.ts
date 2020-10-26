import { Ace } from './Ace';
import { Rights } from './Rights';
import { WellknownIds } from './WellknownIds';
interface IBase {
    _id: string;
    _type: string;
    name: string;
    // getRight(_id: string, deny: boolean): Ace;
    // addRight(_id: string, name: string, Rights: number[], deny: boolean): void;
    // removeRight(_id: string, Rights: number[], deny: boolean): void;
}
export class Base implements IBase {
    _id: string;
    _type: string = 'unknown';
    _acl: Ace[] = [];
    name: string;
    _name: string;
    _encrypt: string[] = [];

    _createdbyid: string;
    _createdby: string;
    _created: Date;
    _modifiedbyid: string;
    _modifiedby: string;
    _modified: Date;
    _version: number = 0;
    constructor() {
        Base.addRight(this, WellknownIds.admins, 'admins', [Rights.full_control]);
    }
    /**
     * Create new instance of object, using values from input object
     * @param  {T} o Base object
     * @returns T New object as Type
     */
    static assign<T>(source: T): T {
        return Object.assign(new Base(), source);
    }
    /**
     * Enumerate ACL for specefic ID
     * @param  {string} _id Id to search for
     * @param  {boolean=false} deny look for deny or allow permission
     * @returns Ace Ace if found, else null
     */
    static getRight(item: Base, _id: string, deny: boolean = false): Ace {
        let result: Ace = null;
        if (!item._acl) {
            item._acl = [];
        }
        item._acl.forEach((a, index) => {
            if (a._id === _id && a.deny === deny) {
                result = item._acl[index];
            }
        });
        return result;
    }
    /**
     * Set right for specefic id, if exists
     * @param  {Ace} x
     * @returns void
     */
    static setRight(item: Base, x: Ace): void {
        if (!item._acl) {
            item._acl = [];
        }
        item._acl.forEach((a, index) => {
            if (a._id === x._id && a.deny === x.deny) {
                item._acl[index] = x;
            }
        });
    }
    /**
     * Add/update right for user/role
     * @param  {string} _id user/role id
     * @param  {string} name Displayname for user/role
     * @param  {number[]} rights Right to set
     * @param  {boolean=false} deny Deny the right
     * @returns void
     */
    static addRight(item: Base, _id: string, name: string, rights: number[], deny: boolean = false): void {
        let right: Ace = Base.getRight(item, _id, deny);
        if (!right) {
            right = new Ace();
            Ace.resetnone(right);
            item._acl.push(right);
        }
        right.deny = deny;
        right._id = _id;
        right.name = name;
        if (rights[0] === -1) {
            for (let i: number = 0; i < 1000; i++) {
                Ace.setBit(right, i);
            }
        } else {
            rights.forEach((bit) => {
                try {
                    Ace.setBit(right, bit);
                } catch (error) {
                    throw error;
                }
            });
        }
        Base.setRight(item, right);
    }
    /**
     * Remove a right from user/role
     * @param  {string} _id user/role id
     * @param  {number[]=null} rights Right to revoke
     * @param  {boolean=false} deny Deny right
     * @returns void
     */
    static removeRight(item: Base, _id: string, rights: number[] = null, deny: boolean = false): void {
        if (!item._acl) {
            item._acl = [];
        }
        const right: Ace = Base.getRight(item, _id, deny);
        if (!right) {
            return;
        }
        if (rights[0] === -1) {
            item._acl = item._acl.filter(x => x._id !== _id);
        } else {
            rights.forEach((bit) => {
                Ace.unsetBit(right, bit);
            });
        }
        Base.setRight(item, right);
    }
    static hasRight(item: Base, _id: string, bit: number, deny: boolean = false): boolean {
        const ace = Base.getRight(item, _id, deny);
        if (ace == null) return false;
        return Ace.isBitSet(ace, bit);
    }
}

import { Ace } from './Ace';
import { Rights } from './Rights';
import { WellknownIds } from './WellknownIds';
interface IBase {
  _id: string;
  _type: string;
  name: string;
  getRight(_id: string, deny: boolean): Ace;
  addRight(_id: string, name: string, Rights: number[], deny: boolean): void;
  removeRight(_id: string, Rights: number[], deny: boolean): void;
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
    this.addRight(WellknownIds.admins, 'admins', [Rights.full_control]);
  }
  /**
   * Create new instance of object, using values from input object
   * @param  {T} o Base object
   * @returns T New object as Type
   */
  static assign<T>(o: T): T {
    return Object.assign(new Base(), o);
  }
  /**
   * Enumerate ACL for specefic ID
   * @param  {string} _id Id to search for
   * @param  {boolean=false} deny look for deny or allow permission
   * @returns Ace Ace if found, else null
   */
  getRight(_id: string, deny: boolean = false): Ace {
    let result: Ace = null;
    if (!this._acl) {
      this._acl = [];
    }
    this._acl.forEach((a, index) => {
      if (a._id === _id && a.deny === deny) {
        this._acl[index] = Ace.assign(a);
        result = this._acl[index];
      }
    });
    if (result) {
      result = Ace.assign(result);
    }
    return result;
  }
  /**
   * Set right for specefic id, if exists
   * @param  {Ace} x
   * @returns void
   */
  setRight(x: Ace): void {
    if (!this._acl) {
      this._acl = [];
    }
    this._acl.forEach((a, index) => {
      if (a._id === x._id && a.deny === x.deny) {
        this._acl[index] = x;
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
  addRight(_id: string, name: string, rights: number[], deny: boolean = false): void {
    let right: Ace = this.getRight(_id, deny);
    if (!right) {
      right = new Ace();
      this._acl.push(right);
    }
    right.deny = deny;
    right._id = _id;
    right.name = name;
    rights.forEach((bit) => {
      right.setBit(bit);
    });
    this.setRight(right);
  }
  /**
   * Remove a right from user/role
   * @param  {string} _id user/role id
   * @param  {number[]=null} rights Right to revoke
   * @param  {boolean=false} deny Deny right
   * @returns void
   */
  removeRight(_id: string, rights: number[] = null, deny: boolean = false): void {
    if (!this._acl) {
      this._acl = [];
    }
    const right: Ace = this.getRight(_id, deny);
    if (!right) {
      return;
    }
    rights.forEach((bit) => {
      right.unsetBit(bit);
    });
    this.setRight(right);
  }
}

import { WebSocketClient } from '..';
import { Ace } from './Ace';
import { Rights } from './Rights';
import { WellknownIds } from './WellknownIds';
interface IBase {
    _id: string;
    _type: string;
    name: string;
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
            if (a._id === _id && (a.deny === deny || a.deny == null)) {
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
            if (a._id === x._id && (a.deny === x.deny || a.deny == null)) {
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
        if (deny == true) right.deny = deny;
        right._id = _id;
        if (name != null && name != "") right.name = name;
        if (rights[0] === -1) {
            Ace.resetfullcontrol(right)
            // for (let i: number = 0; i < 1000; i++) {
            //     Ace.setBit(right, i);
            // }
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


export class WorkitemQueue extends Base {
    constructor() {
        super();
    }
    public workflowid: string;
    public robotqueue: string;
    public amqpqueue: string;
    public projectid: string;
    public usersrole: string;
    public maxretries: number;
    public retrydelay: number;
    public initialdelay: number;
    public success_wiqid: string;
    public failed_wiqid: string;
    public success_wiq: string;
    public failed_wiq: string;
}

export class Workitem extends Base {
    constructor() {
        super();
    }
    public wiqid: string;
    public wiq: string;
    public state: "failed" | "successful" | "processing" | "retry" | "new";
    public payload: any;
    public retries: number;
    public priority: number;
    public files: WorkitemFile[];
    public userid: string;
    public username: string;
    public lastrun: Date;
    public nextrun: Date;
    public errormessage: string;
    public errorsource: string;
    public errortype: "application" | "business";
    public success_wiqid: string;
    public failed_wiqid: string;
    public success_wiq: string;
    public failed_wiq: string;
}

export class WorkitemFile {
    public filename: string;
    public name: string;
    public _id: string;
}


export type AddWorkitemOptions = {
    jwt?: string;
    priority?: number;
    websocket?: WebSocketClient;
    wiqid?: string;
    wiq?: string;
    name?: string;
    payload?: any;
    nextrun?: Date;
    files?: MessageWorkitemFile[];
    success_wiqid?: string;
    failed_wiqid?: string;
    success_wiq?: string;
    failed_wiq?: string;
    traceId?: string,
    spanId?: string,
    wipriority?: number,
}
export class AddWorkitemDefaults {
    public priority: number = 2;
}
export class AddWorkitemMessage {
    public static parse(options: AddWorkitemOptions): [AddWorkitemMessage, number, WebSocketClient, string, string] {
        const defaults = new AddWorkitemDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: AddWorkitemMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public wiqid: string;
    public wiq: string;
    public name: string;
    public payload: any;
    public nextrun: Date;
    public priority: number;
    public wipriority: number;
    public files: MessageWorkitemFile[];
    public success_wiqid: string;
    public failed_wiqid: string;
    public success_wiq: string;
    public failed_wiq: string;
    public result: Workitem;
    static assign(o: any): AddWorkitemMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new AddWorkitemMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new AddWorkitemMessage(), o);
    }
}
export type AddWorkitemBaseOptions = {
    name?: string;
    payload?: any;
    nextrun?: Date;
    priority?: number;
    files?: MessageWorkitemFile[];
    success_wiqid?: string;
    failed_wiqid?: string;
    success_wiq?: string;
    failed_wiq?: string;
    traceId?: string,
    spanId?: string,
    wipriority?: number,
}
export class AddWorkitem {
    static parse(options: AddWorkitemBaseOptions) {
        return Object.assign(new AddWorkitem(), options);
    }
    public name: string;
    public payload: any;
    public nextrun: Date;
    public priority: number;
    public files: MessageWorkitemFile[];
}
export type AddWorkitemsOptions = {
    jwt?: string;
    priority?: number;
    wipriority?: number,
    websocket?: WebSocketClient;
    wiqid?: string;
    wiq?: string;
    items: AddWorkitem[];
    success_wiqid?: string;
    failed_wiqid?: string;
    success_wiq?: string;
    failed_wiq?: string;
    traceId?: string,
    spanId?: string,
}
export class AddWorkitemsDefaults {
    public priority: number = 2;
}
export class AddWorkitemsMessage {
    public static parse(options: AddWorkitemsOptions): [AddWorkitemsMessage, number, WebSocketClient, string, string] {
        const defaults = new AddWorkitemsDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: AddWorkitemsMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public wipriority: number;
    public wiqid: string;
    public wiq: string;
    public items: AddWorkitem[];
    public success_wiqid: string;
    public failed_wiqid: string;
    public success_wiq: string;
    public failed_wiq: string;
    static assign(o: any): AddWorkitemsMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new AddWorkitemsMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new AddWorkitemsMessage(), o);
    }
}
export type UpdateWorkitemOptions = {
    jwt?: string;
    priority?: number;
    websocket?: WebSocketClient;
    _id: string;
    wipriority?: number;
    name?: string;
    state?: "failed" | "successful" | "processing" | "retry";
    payload?: any;
    ignoremaxretries?: boolean;
    errormessage?: string;
    errorsource?: string;
    errortype?: "application" | "business";
    files?: MessageWorkitemFile[];
    success_wiqid?: string;
    failed_wiqid?: string;
    success_wiq?: string;
    failed_wiq?: string;
    traceId?: string,
    spanId?: string,
}
export class UpdateWorkitemDefaults {
    public priority: number = 2;
    public ignoremaxretries: boolean = false;
}
export class UpdateWorkitemMessage {
    public static parse(options: UpdateWorkitemOptions): [UpdateWorkitemMessage, number, WebSocketClient, string, string] {
        const defaults = new UpdateWorkitemDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: UpdateWorkitemMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public _id: string;
    public name: string;
    public state: "failed" | "successful" | "processing" | "retry" | "new";
    public payload: any;
    public wipriority: number;
    public ignoremaxretries: boolean;
    public errormessage: string;
    public errorsource: string;
    public errortype: "application" | "business";
    public files: MessageWorkitemFile[];
    public success_wiqid: string;
    public failed_wiqid: string;
    public success_wiq: string;
    public failed_wiq: string;
    public result: Workitem;
    static assign(o: any): UpdateWorkitemMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new UpdateWorkitemMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new UpdateWorkitemMessage(), o);
    }
}
export type PopWorkitemOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    wiqid?: string,
    wiq?: string;
    traceId?: string,
    spanId?: string,
}
export class PopWorkitemDefaults {
    public priority: number = 2;
}
export class PopWorkitemMessage {
    public static parse(options: PopWorkitemOptions): [PopWorkitemMessage, number, WebSocketClient, string, string] {
        const defaults = new PopWorkitemDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: PopWorkitemMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public wiqid: string;
    public wiq: string;
    public result: Workitem;
    static assign(o: any): PopWorkitemMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new PopWorkitemMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new PopWorkitemMessage(), o);
    }
}
export type DeleteWorkitemOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id: string;
    traceId?: string,
    spanId?: string,
}
export class DeleteWorkitemDefaults {
    public priority: number = 2;
}
export class DeleteWorkitemMessage {
    public static parse(options: DeleteWorkitemOptions): [DeleteWorkitemMessage, number, WebSocketClient, string, string] {
        const defaults = new DeleteWorkitemDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: DeleteWorkitemMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public _id: string;
    static assign(o: any): DeleteWorkitemMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new DeleteWorkitemMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteWorkitemMessage(), o);
    }
}
export type AddWorkitemQueueOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    name: string;
    workflowid?: string;
    robotqueue?: string;
    amqpqueue?: string;
    projectid?: string;
    skiprole?: boolean;
    maxretries?: number;
    retrydelay?: number;
    initialdelay?: number;
    _acl?: any[];
    success_wiqid?: string;
    failed_wiqid?: string;
    success_wiq?: string;
    failed_wiq?: string;
    traceId?: string,
    spanId?: string,
}
export class AddWorkitemQueueDefaults {
    public priority: number = 2;
    public skiprole: false;
    public maxretries: number = 3;
    public retrydelay: number = 0;
    public initialdelay: number = 0;

}
export class AddWorkitemQueueMessage {
    public static parse(options: AddWorkitemQueueOptions): [AddWorkitemQueueMessage, number, WebSocketClient, string, string] {
        const defaults = new AddWorkitemQueueDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: AddWorkitemQueueMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public name: string;
    public workflowid: string;
    public robotqueue: string;
    public amqpqueue: string;
    public projectid: string;
    public skiprole: boolean;
    public maxretries: number;
    public retrydelay: number;
    public initialdelay: number;
    public success_wiqid: string;
    public failed_wiqid: string;
    public success_wiq: string;
    public failed_wiq: string;
    public _acl: any[];
    public result: WorkitemQueue;
    static assign(o: any): AddWorkitemQueueMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new AddWorkitemQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new AddWorkitemQueueMessage(), o);
    }
}
export type GetWorkitemQueueOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id?: string;
    name?: string;
    traceId?: string,
    spanId?: string,
}
export class GetWorkitemQueueDefaults {
    public priority: number = 2;
}
export class GetWorkitemQueueMessage {
    public static parse(options: GetWorkitemQueueOptions): [GetWorkitemQueueMessage, number, WebSocketClient, string, string] {
        const defaults = new AddWorkitemQueueDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: GetWorkitemQueueMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public _id: string;
    public name: string;
    public result: WorkitemQueue;
    static assign(o: any): GetWorkitemQueueMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new GetWorkitemQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetWorkitemQueueMessage(), o);
    }
}
export type UpdateWorkitemQueueOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id?: string;
    name: string;
    _acl?: any[];
    workflowid: string;
    robotqueue: string;
    amqpqueue: string;
    projectid: string;
    purge: boolean;
    maxretries?: number;
    retrydelay?: number;
    initialdelay?: number;
    success_wiqid?: string;
    failed_wiqid?: string;
    success_wiq?: string;
    failed_wiq?: string;
    traceId?: string,
    spanId?: string,
}
export class UpdateWorkitemQueueDefaults {
    public priority: number = 2;
}
export class UpdateWorkitemQueueMessage {
    public static parse(options: UpdateWorkitemQueueOptions): [UpdateWorkitemQueueMessage, number, WebSocketClient, string, string] {
        const defaults = new UpdateWorkitemQueueDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: UpdateWorkitemQueueMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public _id: string;
    public name: string;
    public _acl: any[];
    public workflowid: string;
    public robotqueue: string;
    public amqpqueue: string;
    public projectid: string;
    public purge: boolean;
    public maxretries: number;
    public retrydelay: number;
    public initialdelay: number;
    public success_wiqid: string;
    public failed_wiqid: string;
    public success_wiq: string;
    public failed_wiq: string;
    public result: WorkitemQueue;
    static assign(o: any): UpdateWorkitemQueueMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new UpdateWorkitemQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new UpdateWorkitemQueueMessage(), o);
    }
}
export type DeleteWorkitemQueueOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id?: string;
    name?: string;
    purge: boolean;
    traceId?: string,
    spanId?: string,
}
export class DeleteWorkitemQueueDefaults {
    public priority: number = 2;
}
export class DeleteWorkitemQueueMessage {
    public static parse(options: DeleteWorkitemQueueOptions): [DeleteWorkitemQueueMessage, number, WebSocketClient, string, string] {
        const defaults = new DeleteWorkitemQueueDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: DeleteWorkitemQueueMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public _id: string;
    public name: string;
    public purge: boolean;
    static assign(o: any): DeleteWorkitemQueueMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new DeleteWorkitemQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteWorkitemQueueMessage(), o);
    }
}

export class MessageWorkitemFile {
    public file: string;
    public filename: string;
    public compressed: boolean;
}

import { Ace, Base } from "..";

export type AddWorkitemOptions = {
    jwt?: string,
    wiqid?: string,
    wiq?: string,
    name?: string,
    payload?: any,
    nextrun?: Date,
    priority?: number,
    files?: MessageWorkitemFile[]
}
export class AddWorkitemMessage {
    public error: string;
    public jwt: string;

    public wiqid: string;
    public wiq: string;
    public name: string;
    public payload: any;
    public nextrun: Date;
    public priority: number;
    public files: MessageWorkitemFile[];
    public result: Workitem;
    static assign(o: any): AddWorkitemMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new AddWorkitemMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new AddWorkitemMessage(), o);
    }
}
export class AddWorkitem {
    public name: string;
    public payload: any;
    public nextrun: Date;
    public priority: number;
    public files: MessageWorkitemFile[];
}
export type AddWorkitemsOptions = {
    jwt?: string,
    wiqid?: string,
    wiq?: string,
    items: AddWorkitem[]
}
export class AddWorkitemsMessage {
    public error: string;
    public jwt: string;

    public wiqid: string;
    public wiq: string;
    public items: AddWorkitem[];
    static assign(o: any): AddWorkitemsMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new AddWorkitemsMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new AddWorkitemsMessage(), o);
    }
}
export type UpdateWorkitemOptions = {
    jwt?: string,
    _id: string,
    name: string,
    state: string,
    payload: any,
    ignoremaxretries: boolean,
    errormessage: string,
    errorsource: string,
    files: MessageWorkitemFile[]
}
export class UpdateWorkitemMessage {
    public error: string;
    public jwt: string;

    public _id: string;
    public name: string;
    public state: string;
    public payload: any;
    public ignoremaxretries: boolean;
    public errormessage: string;
    public errorsource: string;
    public files: MessageWorkitemFile[];
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
    wiqid?: string,
    wiq?: string;
}
export class PopWorkitemMessage {
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
    jwt?: string;
    _id: string;
}
export class DeleteWorkitemMessage {
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
    jwt?: string;
    name: string;
    workflowid?: string;
    robotqueue?: string;
    amqpqueue?: string;
    projectid?: string;
    skiprole?: boolean;
    maxretries?: number;
    retrydelay?: number;
    initialdelay?: number;
    _acl?: Ace[];
}
export class AddWorkitemQueueMessage {
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
    public _acl: Ace[];
    public result: WorkitemQueue;
    static assign(o: any): AddWorkitemQueueMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new AddWorkitemQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new AddWorkitemQueueMessage(), o);
    }
}
export type GetWorkitemQueueOptions = {
    jwt?: string;
    _id?: string;
    name?: string;
}
export class GetWorkitemQueueMessage {
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
    jwt?: string;
    _id?: string;
    name: string;
    _acl?: Ace[];
    workflowid: string;
    robotqueue: string;
    amqpqueue: string;
    projectid: string;
    purge: boolean;
    maxretries?: number;
    retrydelay?: number;
    initialdelay?: number;
}
export class UpdateWorkitemQueueMessage {
    public error: string;
    public jwt: string;

    public _id: string;
    public name: string;
    public _acl: Ace[];
    public workflowid: string;
    public robotqueue: string;
    public amqpqueue: string;
    public projectid: string;
    public purge: boolean;
    public maxretries: number;
    public retrydelay: number;
    public initialdelay: number;
    public result: WorkitemQueue;
    static assign(o: any): UpdateWorkitemQueueMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new UpdateWorkitemQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new UpdateWorkitemQueueMessage(), o);
    }
}
export type DeleteWorkitemQueueOptions = {
    jwt?: string;
    _id?: string;
    name?: string;
    purge: boolean;
}
export class DeleteWorkitemQueueMessage {
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
}

export class Workitem extends Base {
    constructor() {
        super();
    }
    public wiqid: string;
    public wiq: string;
    public state: string;
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
}
export class MessageWorkitemFile {
    public file: string;
    public filename: string;
    public compressed: boolean;
}
export class WorkitemFile {
    public filename: string;
    public name: string;
    public _id: string;
}
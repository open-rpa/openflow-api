import { WebSocketClient } from "..";
export type CreateWorkflowInstanceOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    targetid: string,
    workflowid: string,
    resultqueue: string,
    initialrun: boolean,
    correlationId?: string,
    data: any,
    queue?: string;
    name?: string;
}
export class CreateWorkflowInstanceDefaults {
    public priority: number = 2;
    public initialrun: boolean = false;
}
export class CreateWorkflowInstanceMessage {
    public static parse(options: CreateWorkflowInstanceOptions): [CreateWorkflowInstanceMessage, number, WebSocketClient] {
        const defaults = new CreateWorkflowInstanceDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: CreateWorkflowInstanceMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: any;

    public targetid: string;
    public workflowid: string;
    public resultqueue: string;
    public initialrun: boolean;
    public correlationId: string;
    public newinstanceid: string;
    public data: any;
    public queue: string;
    public name: string;
    static assign<T>(o: any): CreateWorkflowInstanceMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new CreateWorkflowInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new CreateWorkflowInstanceMessage(), o);
    }
}
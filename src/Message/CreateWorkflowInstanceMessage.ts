export class CreateWorkflowInstanceMessage {
    public error: string;
    public jwt: any;

    public correlationId: string;
    public newinstanceid: string;
    public state: string;
    public queue: string;
    public workflowid: string;
    public resultqueue: string;
    public targetid: string;
    public parentid: string;
    public initialrun: boolean;
    public form: string;
    public name: string;

    public payload: any;
    static assign<T>(o: any): CreateWorkflowInstanceMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new CreateWorkflowInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new CreateWorkflowInstanceMessage(), o);
    }
}
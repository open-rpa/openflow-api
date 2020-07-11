export class CloseQueueMessage {
    public error: string;
    public jwt: any;

    public queuename: string;
    static assign(o: any): CloseQueueMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new CloseQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new CloseQueueMessage(), o);
    }
}

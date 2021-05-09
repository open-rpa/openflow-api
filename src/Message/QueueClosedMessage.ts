export class QueueClosedMessage {
    public error: string;
    public jwt: any;

    public queuename: string;
    static assign(o: any): QueueClosedMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new QueueClosedMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new QueueClosedMessage(), o);
    }
}
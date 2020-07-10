export class RegisterQueueMessage {
    public error: string;
    public jwt: any;

    public queuename: string;
    static assign(o: any): RegisterQueueMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new RegisterQueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new RegisterQueueMessage(), o);
    }
}
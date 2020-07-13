import { TokenUser } from "../nodeclient/TokenUser";

export class QueueMessage {
    public error: string;
    public jwt: any;
    public user: TokenUser;

    public correlationId: string;
    public replyto: string;
    public queuename: string;
    public data: any;
    public expiration: number;

    public consumerTag: string;
    public routingkey: string;
    public exchange: string;
    static assign(o: any): QueueMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new QueueMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new QueueMessage(), o);
    }
}
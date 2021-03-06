export type QueuedMessageCallback = (msg: any) => any;
export type QueuedMessageStatusCallback = (msg: any, index: number, count: number) => any;
export class QueuedMessage {
    constructor(message: any, cb: QueuedMessageCallback) {
        this.id = message.id;
        this.message = message;
        this.cb = cb;
        this.timestamp = new Date();
    }
    public cb: QueuedMessageCallback;
    public id: string;
    public message: any;
    public error: string;
    public timestamp: Date;
}

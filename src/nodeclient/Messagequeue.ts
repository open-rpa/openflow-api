import { QueueMessage } from "../Message/QueueMessage";

export class Messagequeue {
    constructor(public msg: QueueMessage, public callback: any) { }
}

import { isNumber } from "util";
import { Message } from "../nodeclient/Message";

export class SocketMessage {
    public id: string;
    public replyto: string;
    public command: string;
    public data: string;
    public count: number;
    public index: number;
    public static fromjson(json: string): SocketMessage {
        const result: SocketMessage = new SocketMessage();
        const obj: any = JSON.parse(json);
        result.command = obj.command;
        result.id = obj.id;
        result.replyto = obj.replyto;
        result.count = 1;
        result.index = 0;
        result.data = obj.data;
        if (isNumber(obj.count)) {
            result.count = obj.count;
        }
        if (isNumber(obj.index)) {
            result.index = obj.index;
        }
        if (result.id === null || result.id === undefined || result.id === '') {
            // result.id = crypto.randomBytes(16).toString("hex");
            result.id = Math.random().toString(36).substr(2, 9);
        }
        return result;
    }
    public static frommessage(msg: Message, data: string, count: number, index: number): SocketMessage {
        const result: SocketMessage = new SocketMessage();
        result.id = msg.id;
        result.replyto = msg.replyto;
        result.command = msg.command;
        result.count = count;
        result.index = index;
        result.data = data;
        return result;
    }
    public static fromcommand(command: string): SocketMessage {
        const result: SocketMessage = new SocketMessage();
        result.command = command;
        result.count = 1;
        result.index = 0;
        result.id = Math.random().toString(36).substr(2, 9);
        return result;
    }
}
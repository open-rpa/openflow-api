import { isNumber } from "util";
import { NoderedUtil } from "..";
import { Message } from "../nodeclient/Message";

export class SocketMessage {
    public id: string;
    public replyto: string;
    public command: string;
    public traceId: string;
    public spanId: string;
    public data: string;
    public count: number;
    public index: number;
    public priority: number = 1;
    public static fromjson(json: string): SocketMessage {
        const result: SocketMessage = new SocketMessage();
        const obj: any = JSON.parse(json);
        result.command = obj.command;
        result.id = obj.id;
        result.replyto = obj.replyto;
        result.count = 1;
        result.index = 0;
        result.data = obj.data;
        result.traceId = obj.traceId;
        result.spanId = obj.spanId;
        if (typeof obj.count === "number") {
            result.count = obj.count;
        }
        if (typeof obj.index === "number") {
            result.index = obj.index;
        }
        if (result.id === null || result.id === undefined || result.id === '') {
            result.id = NoderedUtil.GetUniqueIdentifier();
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
        result.traceId = msg.traceId;
        result.spanId = msg.spanId;
        result.data = data;
        return result;
    }
    public static fromcommand(command: string): SocketMessage {
        const result: SocketMessage = new SocketMessage();
        result.command = command;
        result.count = 1;
        result.index = 0;
        result.id = NoderedUtil.GetUniqueIdentifier();
        return result;
    }
}
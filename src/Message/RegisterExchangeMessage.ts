import { WebSocketClient } from "..";
import { ExchangeClosed, QueueOnMessage } from "../nodeclient/NoderedUtil";
export type RegisterExchangeOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    exchangename: string,
    algorithm: "direct" | "fanout" | "topic" | "header",
    routingkey?: string,
    callback: QueueOnMessage,
    closedcallback: ExchangeClosed,
    traceId?: string,
    spanId?: string,
}
export class RegisterExchangeDefaults {
    public priority: number = 2;
    public routingkey: string = "";
}
export class RegisterExchangeMessage {
    public static parse(options: RegisterExchangeOptions): [RegisterExchangeMessage, number, WebSocketClient, QueueOnMessage, ExchangeClosed, string, string] {
        const defaults = new RegisterExchangeDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: RegisterExchangeMessage = Object.assign(defaults, options) as any;
        const callback = (options.callback ? options.callback : undefined);
        const closedcallback = (options.closedcallback ? options.closedcallback : undefined);
        delete (q as any).callback;
        delete (q as any).closedcallback;
        delete (q as any).websocket;
        return [q, priority, websocket, callback, closedcallback, traceId, spanId];
    }
    public error: string;
    public jwt: any;

    public exchangename: string;
    public algorithm: "direct" | "fanout" | "topic" | "header";
    public routingkey: string = "";
    public queuename: string;
    public addqueue: boolean;
    static assign(o: any): RegisterExchangeMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new RegisterExchangeMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new RegisterExchangeMessage(), o);
    }
}
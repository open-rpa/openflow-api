import { WebSocketClient } from "..";
export type StripeCancelPlanOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    resourceusageid: string,
    quantity?: number,
    traceId?: string,
    spanId?: string,
}
export class StripeCancelPlanDefaults {
    public priority: number = 2;
    public quantity: number = 1;
}
export class StripeCancelPlanMessage {
    public static parse(options: StripeCancelPlanOptions): [StripeCancelPlanMessage, number, WebSocketClient, string, string] {
        const defaults = new StripeCancelPlanDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: StripeCancelPlanMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public quantity: number = 1;
    public resourceusageid: string;
    static assign(o: any): StripeCancelPlanMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StripeCancelPlanMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StripeCancelPlanMessage(), o);
    }
}

import { stripe_base } from "../stripe/stripe_base";
import { WebSocketClient } from "..";
export type StripeOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    object: string,
    method: string,
    customerid?: string,
    id?: string,
    payload?: stripe_base,
    traceId?: string,
    spanId?: string,
}
export class StripeDefaults {
    public priority: number = 2;
}
export class StripeMessage {
    public static parse(options: StripeOptions): [StripeMessage, number, WebSocketClient, string, string] {
        const defaults = new StripeDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: StripeMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: any;
    public method: string;
    public object: string;
    public id: string;
    public customerid: string;
    public url: string;
    public payload: stripe_base;

    static assign(o: any): StripeMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StripeMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StripeMessage(), o);
    }
}
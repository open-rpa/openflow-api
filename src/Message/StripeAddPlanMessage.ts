import { stripe_customer } from "../stripe/stripe_customer";
import { WebSocketClient } from "..";
export type StripeAddPlanOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    userid?: string,
    customerid: string,
    resourceid: string,
    stripeprice: string,
    traceId?: string,
    spanId?: string,
}
export class StripeAddPlanDefaults {
    public priority: number = 2;
}
export class StripeAddPlanMessage {
    public static parse(options: StripeAddPlanOptions): [StripeAddPlanMessage, number, WebSocketClient, string, string] {
        const defaults = new StripeAddPlanDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: StripeAddPlanMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public userid: string;
    public customerid: string;
    public resourceid: string;
    public stripeprice: string
    public quantity: number = 1;

    public stripecustomer: stripe_customer;
    public checkout: any;
    static assign(o: any): StripeAddPlanMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StripeAddPlanMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StripeAddPlanMessage(), o);
    }
}

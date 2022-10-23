import { WebSocketClient } from "..";
import { stripe_invoice } from "../stripe/stripe_invoice";
export type GetNextInvoiceOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    customerid: string,
    subscriptionid?: string,
    subscription_items?: subscription_item[],
    proration_date?: number,
    traceId?: string,
    spanId?: string,
}
export class GetNextInvoiceDefaults {
    public priority: number = 2;
}
export class GetNextInvoiceMessage {
    public static parse(options: GetNextInvoiceOptions): [GetNextInvoiceMessage, number, WebSocketClient, string, string] {
        const defaults = new GetNextInvoiceDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: GetNextInvoiceMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public customerid: string;
    public subscriptionid: string;
    public subscription_items: subscription_item[];
    public proration_date: number;

    public invoice: stripe_invoice;
    static assign(o: any): GetNextInvoiceMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new GetNextInvoiceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetNextInvoiceMessage(), o);
    }
}
export class subscription_item {
    public id?: string;
    public price?: string
    public quantity?: number;
}
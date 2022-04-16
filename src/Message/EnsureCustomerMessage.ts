import { Billing } from "../stripe/Billing";
import { Customer } from "../nodeclient/Customer";
import { stripe_customer } from "../stripe/stripe_customer";

import { WebSocketClient } from "..";
export type EnsureCustomerOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    customer: Customer
}
export class EnsureCustomerDefaults {
    public priority: number = 2;
}
export class EnsureCustomerMessage {
    public static parse(options: EnsureCustomerOptions): [EnsureCustomerMessage, number, WebSocketClient] {
        const defaults = new EnsureCustomerDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: EnsureCustomerMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: string;

    public billing: Billing;
    public customer: Customer;
    public stripecustomer: stripe_customer;
    static assign(o: any): EnsureCustomerMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new EnsureCustomerMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new EnsureCustomerMessage(), o);
    }
}
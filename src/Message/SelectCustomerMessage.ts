import { WebSocketClient } from "..";
export type SelectCustomerOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    customerid: string
}
export class SelectCustomerDefaults {
    public priority: number = 2;
}
export class SelectCustomerMessage {
    public static parse(options: SelectCustomerOptions): [SelectCustomerMessage, number, WebSocketClient] {
        const defaults = new SelectCustomerDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: SelectCustomerMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: string;

    public customerid: string;
    static assign(o: any): SelectCustomerMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new SelectCustomerMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new SelectCustomerMessage(), o);
    }
}
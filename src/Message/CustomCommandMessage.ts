import { WebSocketClient } from "..";
export type CustomCommandOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    command: string;
    id?: string;
    data?: any,
    name?: string;
}
export class CustomCommandDefaults {
    public priority: number = 2;
}
export class CustomCommandMessage {
    public static parse(options: CustomCommandOptions): [CustomCommandMessage, number, WebSocketClient] {
        const defaults = new CustomCommandDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: CustomCommandMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: any;

    public command: string;
    public id?: string;
    public name?: string;
    public result?: any;
    static assign<T>(o: any): CustomCommandMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new CustomCommandMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new CustomCommandMessage(), o);
    }
}
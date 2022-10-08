import { WebSocketClient } from "..";
export type ListCollectionsOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    includehist?: boolean;
}
export class ListCollectionsDefaults {
    public priority: number = 2;
    public includehist: boolean = false;
}
export class ListCollectionsMessage {
    public static parse(options: ListCollectionsOptions): [ListCollectionsMessage, number, WebSocketClient] {
        const defaults = new ListCollectionsDefaults();
        if (options == null) options = {};
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: ListCollectionsMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: string;
    public includehist: boolean;
    public result: any;
    static assign(o: any): ListCollectionsMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new ListCollectionsMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new ListCollectionsMessage(), o);
    }
}

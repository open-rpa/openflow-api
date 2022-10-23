import { WebSocketClient } from "..";
import { WatchOnMessage } from "../nodeclient/NoderedUtil";
export type WatchOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    aggregates: object[],
    callback: WatchOnMessage,
    traceId?: string,
    spanId?: string,
}
export class WatchDefaults {
    public priority: number = 2;
}
export class WatchMessage {
    public static parse(options: WatchOptions): [WatchMessage, number, WebSocketClient, WatchOnMessage, string, string] {
        const defaults = new WatchDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: WatchMessage = Object.assign(defaults, options) as any;
        const callback = (options.callback ? options.callback : undefined);
        return [q, priority, websocket, callback, traceId, spanId];
    }
    public error: string;
    public jwt: string;

    public aggregates: object[];
    public collectionname: string;
    public id: string;
    public result: string;
    static assign(o: any): WatchMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new WatchMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new WatchMessage(), o);
    }
}

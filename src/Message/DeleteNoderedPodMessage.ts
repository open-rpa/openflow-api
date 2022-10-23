import { WebSocketClient } from "..";
export type DeleteNoderedPodOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id: string,
    instancename: string,
    traceId?: string,
    spanId?: string,
}
export class DeleteNoderedPodDefaults {
    public priority: number = 2;
}
export class DeleteNoderedPodMessage {
    public static parse(options: DeleteNoderedPodOptions): [DeleteNoderedPodMessage, number, WebSocketClient, string, string] {
        const defaults = new DeleteNoderedPodDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: DeleteNoderedPodMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: any;
    public instancename: string;
    public _id: string;
    static assign(o: any): DeleteNoderedPodMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new DeleteNoderedPodMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteNoderedPodMessage(), o);
    }
}

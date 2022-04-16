import { WebSocketClient } from "..";
export type DeleteNoderedPodOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    _id: string,
    instancename: string
}
export class DeleteNoderedPodDefaults {
    public priority: number = 2;
}
export class DeleteNoderedPodMessage {
    public static parse(options: DeleteNoderedPodOptions): [DeleteNoderedPodMessage, number, WebSocketClient] {
        const defaults = new DeleteNoderedPodDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: DeleteNoderedPodMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket];
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

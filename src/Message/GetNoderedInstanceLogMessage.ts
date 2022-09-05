import { WebSocketClient } from "..";
export type GetNoderedInstanceLogOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    name?: string,
    instancename?: string,
    _id?: string,
}
export class GetNoderedInstanceLogDefaults {
    public priority: number = 2;
}
export class GetNoderedInstanceLogMessage {
    public static parse(options: GetNoderedInstanceLogOptions): [GetNoderedInstanceLogMessage, number, WebSocketClient] {
        const defaults = new GetNoderedInstanceLogDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const q: GetNoderedInstanceLogMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket];
    }
    public error: string;
    public jwt: any;
    public name: string;
    public instancename: string;
    public _id: string;
    public result: string;
    static assign(o: any): GetNoderedInstanceLogMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new GetNoderedInstanceLogMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetNoderedInstanceLogMessage(), o);
    }
}
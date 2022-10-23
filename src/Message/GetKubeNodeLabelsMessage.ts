import { WebSocketClient } from "..";
export type GetKubeNodeLabelsOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    traceId?: string,
    spanId?: string,
}
export class GetKubeNodeLabelsDefaults {
    public priority: number = 2;
}
export class GetKubeNodeLabelsMessage {
    public static parse(options: GetKubeNodeLabelsOptions): [GetKubeNodeLabelsMessage, number, WebSocketClient, string, string] {
        const defaults = new GetKubeNodeLabelsDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: GetKubeNodeLabelsMessage = Object.assign(defaults, options) as any;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: any;
    public result: any;
    static assign(o: any): GetKubeNodeLabelsMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new GetKubeNodeLabelsMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetKubeNodeLabelsMessage(), o);
    }
}
export class WatchEventMessage {
    public error: string;
    public jwt: string;
    public id: string;
    public result: any;
    public traceId: string;
    public spanId: string;
    static assign(o: any): WatchEventMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new WatchEventMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new WatchEventMessage(), o);
    }
}

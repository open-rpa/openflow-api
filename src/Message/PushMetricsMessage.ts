export class PushMetricsMessage {
    public error: string;
    public jwt: string;

    public metrics: string;
    static assign(o: any): PushMetricsMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new PushMetricsMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new PushMetricsMessage(), o);
    }
}
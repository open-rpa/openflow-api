export type GetKubeNodeLabelsOptions = {
    jwt?: string,
    priority?: number,
}
export class GetKubeNodeLabelsDefaults {
    public priority: number = 2;
}
export class GetKubeNodeLabelsMessage {
    public static parse(options: GetKubeNodeLabelsOptions): [GetKubeNodeLabelsMessage, number] {
        const defaults = new GetKubeNodeLabelsDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: GetKubeNodeLabelsMessage = Object.assign(defaults, options) as any;
        return [q, priority];
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
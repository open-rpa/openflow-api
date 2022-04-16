export type GetNoderedInstanceOptions = {
    jwt?: string,
    priority?: number,
    name?: string,
    _id?: string,
}
export class GetNoderedInstanceDefaults {
    public priority: number = 2;
}
export class GetNoderedInstanceMessage {
    public static parse(options: GetNoderedInstanceOptions): [GetNoderedInstanceMessage, number] {
        const defaults = new GetNoderedInstanceDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: GetNoderedInstanceMessage = Object.assign(defaults, options) as any;
        return [q, priority];
    }
    public error: string;
    public jwt: any;
    public name: string;
    public _id: string;
    public results: any[];

    static assign(o: any): GetNoderedInstanceMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new GetNoderedInstanceMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetNoderedInstanceMessage(), o);
    }
}
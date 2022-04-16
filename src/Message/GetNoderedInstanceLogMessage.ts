export type GetNoderedInstanceLogOptions = {
    jwt?: string,
    priority?: number,
    name?: string,
    instancename?: string,
    _id?: string,
}
export class GetNoderedInstanceLogDefaults {
    public priority: number = 2;
}
export class GetNoderedInstanceLogMessage {
    public static parse(options: GetNoderedInstanceLogOptions): [GetNoderedInstanceLogMessage, number] {
        const defaults = new GetNoderedInstanceLogDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: GetNoderedInstanceLogMessage = Object.assign(defaults, options) as any;
        return [q, priority];
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
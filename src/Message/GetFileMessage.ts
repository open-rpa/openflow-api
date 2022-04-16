export type GetFileOptions = {
    jwt?: string,
    priority?: number,
    filename?: string,
    id?: string,
    compress?: boolean;
}
export class GetFileDefaults {
    public priority: number = 2;
    public compress: boolean = false;
}
export class GetFileMessage {
    public static parse(options: GetFileOptions): [GetFileMessage, number] {
        const defaults = new GetFileDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: GetFileMessage = Object.assign(defaults, options) as any;
        return [q, priority];
    }
    public error: string;
    public jwt: string;

    public compress: boolean;
    public filename: string;
    public id: string;
    public mimeType: string;
    public metadata: any;
    public file: string;
    static assign(o: any): GetFileMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new GetFileMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetFileMessage(), o);
    }
}
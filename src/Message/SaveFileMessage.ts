import { Base } from "..";
export type SaveFileOptions = {
    jwt?: string,
    priority?: number,
    compressed?: boolean,
    filename: string,
    mimeType?: string,
    metadata?: any,
    file: string,
}
export class SaveFileDefaults {
    public priority: number = 2;
    public compressed: boolean = false;
}
export class SaveFileMessage {
    public static parse(options: SaveFileOptions): [SaveFileMessage, number] {
        const defaults = new SaveFileDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: SaveFileMessage = Object.assign(defaults, options) as any;
        return [q, priority];
    }
    public error: string;
    public jwt: string;

    public compressed: boolean;
    public filename: string;
    public mimeType: string;
    public id: string;
    public metadata: any;
    public file: string;
    public result: Base;
    static assign(o: any): SaveFileMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new SaveFileMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new SaveFileMessage(), o);
    }
}
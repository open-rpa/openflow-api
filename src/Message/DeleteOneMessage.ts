export type DeleteOneOptions = {
    jwt?: string,
    priority?: number,
    collectionname: string,
    id: string,
    recursive?: boolean
}
export class DeleteOneDefaults {
    public priority: number = 2;
    public recursive: boolean = false;
}
export class DeleteOneMessage {
    public static parse(options: DeleteOneOptions): [DeleteOneMessage, number] {
        const defaults = new DeleteOneDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: DeleteOneMessage = Object.assign(defaults, options) as any;
        return [q, priority];
    }
    public error: string;
    public jwt: string;
    public recursive: boolean;

    public id: string;
    public collectionname: string;
    static assign(o: any): DeleteOneMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new DeleteOneMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteOneMessage(), o);
    }
}
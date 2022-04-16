export type DeleteManyOptions = {
    jwt?: string,
    priority?: number,
    collectionname: string,
    ids?: string[];
    query?: any;
}
export class DeleteManyDefaults {
    public priority: number = 2;
}
export class DeleteManyMessage {
    public static parse(options: DeleteManyOptions): [DeleteManyMessage, number] {
        const defaults = new DeleteManyDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: DeleteManyMessage = Object.assign(defaults, options) as any;
        return [q, priority];
    }
    public error: string;
    public jwt: string;

    public ids: string[];
    public query: any;
    // public failed: string[];
    // public affected: string[];
    public affectedrows: number;
    public collectionname: string;
    static assign(o: any): DeleteManyMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new DeleteManyMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteManyMessage(), o);
    }
}
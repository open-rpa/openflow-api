export type UnWatchOptions = {
    jwt?: string,
    priority?: number,
    id: string
}
export class UnWatchDefaults {
    public priority: number = 2;
}
export class UnWatchMessage {
    public static parse(options: UnWatchOptions): [UnWatchMessage, number] {
        const defaults = new UnWatchDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const q: UnWatchMessage = Object.assign(defaults, options) as any;
        return [q, priority];
    }
    public error: string;
    public jwt: string;

    public id: string;
    static assign(o: any): UnWatchMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new UnWatchMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new UnWatchMessage(), o);
    }
}

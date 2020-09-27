export class UnWatchMessage {
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

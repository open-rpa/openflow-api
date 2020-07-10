export class UpdateFileMessage {
    public error: string;
    public jwt: string;

    public id: string;
    public metadata: any;
    static assign(o: any): UpdateFileMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new UpdateFileMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new UpdateFileMessage(), o);
    }
}

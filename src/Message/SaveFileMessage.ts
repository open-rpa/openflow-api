export class SaveFileMessage {
    public error: string;
    public jwt: string;

    public filename: string;
    public mimeType: string;
    public id: string;
    public metadata: any;
    public file: string;
    static assign(o: any): SaveFileMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new SaveFileMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new SaveFileMessage(), o);
    }
}
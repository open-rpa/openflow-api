export class GetFileMessage {
    public error: string;
    public jwt: string;

    public filename: string;
    public mimeType: string;
    public id: string;
    public metadata: any;
    public file: string;
    static assign(o: any): GetFileMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new GetFileMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetFileMessage(), o);
    }
}
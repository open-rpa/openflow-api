import { Base } from "..";

export class SaveFileMessage {
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
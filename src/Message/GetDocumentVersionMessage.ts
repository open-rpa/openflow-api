export class GetDocumentVersionMessage {
    public error: string;
    public jwt: string;

    public _id: string;
    public version: number;
    public collectionname: string;
    public result: any;
    static assign(o: any): GetDocumentVersionMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new GetDocumentVersionMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetDocumentVersionMessage(), o);
    }
}
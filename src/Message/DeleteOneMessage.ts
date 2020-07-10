export class DeleteOneMessage {
    public error: string;
    public jwt: string;

    public _id: string;
    public collectionname: string;
    static assign(o: any): DeleteOneMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new DeleteOneMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteOneMessage(), o);
    }
}
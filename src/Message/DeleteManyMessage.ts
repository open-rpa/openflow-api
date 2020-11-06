export class DeleteManyMessage {
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
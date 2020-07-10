export class DeleteNoderedPodMessage {
    public error: string;
    public jwt: any;
    public name: string;
    public _id: string;
    static assign(o: any): DeleteNoderedPodMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new DeleteNoderedPodMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new DeleteNoderedPodMessage(), o);
    }
}

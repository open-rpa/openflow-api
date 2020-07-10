export class GetNoderedInstanceLogMessage {
    public error: string;
    public jwt: any;
    public name: string;
    public instancename: string;
    public _id: string;
    public result: string;
    static assign(o: any): GetNoderedInstanceLogMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new GetNoderedInstanceLogMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetNoderedInstanceLogMessage(), o);
    }
}
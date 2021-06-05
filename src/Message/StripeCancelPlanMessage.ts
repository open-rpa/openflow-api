export class StripeCancelPlanMessage {
    public error: string;
    public jwt: string;

    public quantity: number = 1;
    public resourceusageid: string;
    static assign(o: any): StripeCancelPlanMessage {
        if (typeof o === "string" || o instanceof String) {
            return Object.assign(new StripeCancelPlanMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new StripeCancelPlanMessage(), o);
    }
}

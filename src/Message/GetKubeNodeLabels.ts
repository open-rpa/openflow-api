
export class GetKubeNodeLabels {
    public error: string;
    public jwt: any;
    public result: any;
    static assign(o: any): GetKubeNodeLabels {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new GetKubeNodeLabels(), JSON.parse(o.toString()));
        }
        return Object.assign(new GetKubeNodeLabels(), o);
    }
}
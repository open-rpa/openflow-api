export declare function emit(k: any, v: any): void;
export type mapFunc = () => void;
export type reduceFunc = (key: string, values: any[]) => any;
export type finalizeFunc = (key: string, value: any) => any;

export class MapReduceMessage {
    public error: string;
    public jwt: string;

    public collectionname: string;
    public result: any[];
    public scope: any;

    constructor(
        public map: mapFunc,
        public reduce: reduceFunc,
        public finalize: finalizeFunc,
        public query: any,
        public out: string | any,
    ) { }
    static assign(o: any): MapReduceMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new MapReduceMessage(null, null, null, null, null), JSON.parse(o.toString()));
        }
        return Object.assign(new MapReduceMessage(null, null, null, null, null), o);
    }
}

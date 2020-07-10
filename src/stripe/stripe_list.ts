// tslint:disable-next-line: class-name
export class stripe_list<T> {
    public object: string;
    // tslint:disable-next-line: variable-name
    public has_more: boolean;
    // tslint:disable-next-line: variable-name
    public total_count: number;
    public url: string;
    public data: T[];
}

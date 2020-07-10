
export class JSONfn {
    public static stringify(obj) {
        return JSON.stringify(obj, (key, value) => {
            return typeof value === 'function' ? value.toString() : value;
        });
    }
    public static parse(str) {
        return JSON.parse(str, (key, value) => {
            if (typeof value !== 'string') return value;
            // tslint:disable-next-line: no-eval
            return value.substring(0, 8) === 'function' ? eval('(' + value + ')') : value;
        });
    }
}
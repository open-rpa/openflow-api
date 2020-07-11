import { TokenUser } from "../nodeclient/TokenUser";

export class SigninMessage {
    public error: string;

    public username: string;
    public password: string;
    // tslint:disable-next-line: variable-name
    public validate_only: boolean = false;
    public clientagent: string;
    public clientversion: string;
    public user: TokenUser;
    public jwt: string;
    public rawAssertion: string;
    public longtoken: boolean = false;

    public realm: string;
    public impersonate: string;
    public onesignalid: string;
    public device: any;
    public gpslocation: any;
    public firebasetoken: string;
    // tslint:disable-next-line: variable-name
    public websocket_package_size: number;

    static assign(o: any): SigninMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new SigninMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new SigninMessage(), o);
    }
}
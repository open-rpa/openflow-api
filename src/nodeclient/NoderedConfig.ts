import { Resources } from "./Resources";
export class NoderedConfig {
    constructor() {
        this.resources = new Resources();
    }
    public resources: Resources;
    // tslint:disable-next-line: variable-name
    public api_allow_anonymous: boolean = false;
    // tslint:disable-next-line: variable-name
    public queue_prefix: string = "";
    public function_external_modules: boolean;
    public nodered_image_name: string;
}

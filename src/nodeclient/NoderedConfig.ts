export class NoderedConfig {
    constructor() {
        this.resources = new KubeResources();
    }
    public resources: KubeResources;
    // tslint:disable-next-line: variable-name
    public api_allow_anonymous: boolean = false;
    // tslint:disable-next-line: variable-name
    public queue_prefix: string = "";
    public function_external_modules: boolean;
    public nodered_image_name: string;
}
export class KubeResources {
    public limits: KubeResourceValues;
    public requests: KubeResourceValues;
}
export class KubeResourceValues {
    public cpu: string;
    public memory: string;
}

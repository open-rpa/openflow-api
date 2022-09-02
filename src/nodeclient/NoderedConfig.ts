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
    public autocreate: boolean;
    public codeeditor_lib: string;
    public monaco: boolean;
    public tours: boolean;
    public catalogues: string[];
    public tz: string;
}
export class KubeResources {
    public limits: KubeResourceValues;
    public requests: KubeResourceValues;
}
export class KubeResourceValues {
    public cpu: string;
    public memory: string;
}

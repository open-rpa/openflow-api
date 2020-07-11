export class FederationId {
    constructor(id: string, issuer: string) {
        this.id = id; this.issuer = issuer;
    }
    public id: string;
    public issuer: string;
}

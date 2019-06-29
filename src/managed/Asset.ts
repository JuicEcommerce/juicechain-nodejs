import {Node} from "./Node";

export class Asset {

    public name: string;
    public publisher: string;
    public title: string;
    public amount: number;
    public type: string;
    public description: string;
    public valid: boolean;
    public master: boolean;
    public mediaUrl: string;
    public mediaType: string;
    public card: string;
    public issuer: string;
    public inception: Date;
    public expiration: Date;

    private node: Node;

    constructor(node: Node){
        this.node = node;
    }

    public async setParameters(inception: Date, expiration: Date): Promise<boolean> {

        let params = {};
        if (inception != null){
            params["inception"] = inception;
        }
        if (expiration != null){
            params["expiration"] = expiration;
        }

        try {
            let response = await this.node.request().requestPost("node/asset/parameters", params, "");
            if (response) {
                return response.success as boolean;
            }
            return null;
        } catch(exception) {
            return exception;
        }

    }

    public async setCard(imageData: Buffer): Promise<boolean> {
        try {
            let response = await this.node.request().requestUpload("node/asset/card", this.name, imageData);
            if (response) {
                return response.success;
            }
            return false;
        } catch(exception) {
            return exception;
        }
    }

    public async setMedia(imageData: Buffer): Promise<boolean> {
        try {
            let response = await this.node.request().requestUpload("node/asset/media", this.name, imageData);
            if (response) {
                return response.success;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public parse(json: any){
        this.name = json.name;
        this.publisher = json.publisher;
        this.description = json.description;
        this.master = json.master;
        this.amount = json.amount;
        this.type = json.type;

        if (json.media){
            this.mediaUrl = json.media.url;
            this.card = json.media.card;
            this.mediaType = json.media.type;
        }

        if (json.inception){
            this.inception = new Date(json.inception);
        }

        if (json.expiration) {
            this.expiration = new Date(json.expiration);
        }

        this.issuer = json.issuer;
    }

}

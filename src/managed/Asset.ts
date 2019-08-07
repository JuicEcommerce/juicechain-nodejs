import {Node} from "./Node";
import {MultiLocaleString} from "../models/MultiLocaleString";
import {AssetParameters} from "../models/AssetParameter";

export enum PARAMETER {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}

export class Asset {

    public name: string;
    public publisher: string;
    public title: MultiLocaleString;
    public amount: number;
    public type: string;
    public description: MultiLocaleString;
    public valid: boolean;
    public master: boolean;
    public issuer: string;
    public inception: Date;
    public expiration: Date;
    public transferable: string;
    public content: any;
    public media: any;
    public disabled: boolean;

    private node: Node;

    constructor(node: Node){
        this.node = node;
    }

    public async setTitle(title: MultiLocaleString): Promise<boolean> {
        try {
            let response = await this.node.request().requestPut("node/asset/title", {
                name: this.name,
                title: title
            }, "");
            if (response) {
                return response.success as boolean;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public async setDescription(description: MultiLocaleString): Promise<boolean> {
        try {
            let response = await this.node.request().requestPut("node/asset/description", {
                name: this.name,
                description: description
            }, "");
            if (response) {
                return response.success as boolean;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public async setParameters(parameter: AssetParameters): Promise<boolean> {
        try {
            let response = await this.node.request().requestPut("node/asset/parameter", {
                name: this.name,
                parameter: parameter
            }, "");
            if (response) {
                return response.success as boolean;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public async setContent(content: any): Promise<boolean>{
        try {
            let response = await this.node.request().requestPut("node/asset/content", {
                name: this.name,
                content: content
            }, "");
            if (response) {
                return response.success as boolean;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public async setCard(imageData: Buffer, style: string): Promise<boolean> {
        try {
            let response = await this.node.request()
                .requestUpload("node/asset/media", this.name, imageData, "card", style);
            if (response) {
                return response.success;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public async setTicket(imageData: Buffer, style: string): Promise<boolean> {
        try {
            let response = await this.node.request()
                .requestUpload("node/asset/media", this.name, imageData, "ticket", style);
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
        this.title = json.title;
        this.publisher = json.publisher;
        this.description = json.description;
        this.master = json.master;
        this.amount = json.amount;
        this.type = json.type;
        this.media = json.media;
        this.content = json.content;
        if (json.inception){
            this.inception = new Date(json.inception);
        }
        if (json.expiration) {
            this.expiration = new Date(json.expiration);
        }
        this.transferable = json.transferable;
        this.valid = json.valid;
        this.issuer = json.issuer;
        this.disabled = json.disabled;
    }

}

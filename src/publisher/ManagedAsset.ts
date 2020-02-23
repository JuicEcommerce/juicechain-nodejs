import {Asset} from "../models/Asset";
import {Publisher} from "./Publisher";
import {AssetParameters} from "../core/types/AssetParameter";
import {LocalizedString} from "../core/types/LocalizedString";

/**
 *  Asset Model
 */
export class ManagedAsset extends Asset {

    private _publisher: Publisher;

    constructor(publisher: Publisher){
        super();
        this._publisher = publisher;
    }

    public async setTitle(title: LocalizedString): Promise<boolean> {
        try {
            let response = await this._publisher.getHost().request().put("publisher/asset/" + this.id, {
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

    public async setDescription(description: LocalizedString): Promise<boolean> {
        try {
            let response = await this._publisher.getHost().request().put("publisher/asset/" + this.id, {
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
            let response = await this._publisher.getHost().request().put("publisher/asset/" + this.id, {
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

    public async setContent(content: any, type: string): Promise<boolean>{
        try {
            let response = await this._publisher.getHost().request()
                .putMultipart("publisher/"+this.id+"/content/", content, "");
            if (response) {
                return response.success;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public toJSON(){
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            quantity: this.quantity,
            extended: this.extended,
            content: this.content,
            transferLock: this.transferLock,
            validation: this.validation,
            active: this.active
        };
    }

}

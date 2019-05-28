import { JuicEchain } from "../JuicEchain";
import { Asset } from "../models/Asset";
import { AssetParams } from "../models/AssetParams";
import * as util from "util";
import { readFile } from "fs";

let read = util.promisify(readFile);

export class AssetService {

    private juicechain: JuicEchain;

    constructor(juicechain: JuicEchain) {
        this.juicechain = juicechain;
    }

    public async issue(name: string, title: string, type: string, amount: number, 
                        targetAddress: string, publisher: string, signature: string): Promise<Asset> {
        
        let _title = {"de_DE": title};

        let _options = {
            transferAll: true,
            transferNode: true,
            returnAddress: null
        };

        let issueRequest = {
            name: name,
            title: _title,
            type: type,
            amount: amount,
            target: targetAddress,
            publisher: publisher,
            options: _options
        };

        try {
            let response = await this.juicechain.requestPost("assets/", issueRequest, signature);
            let asset: Asset = new Asset();
            asset = response.payload;
            return asset;
        } catch(exception) {
            return exception;
        }


    }

    public async issueNFT(name: string, receiver: string, content: string, params: AssetParams, 
                    amount: number, signature: string): Promise<Asset> {
        
        let issueRequest = {
            name: name,
            receiver: receiver,
            content: content,
            amount: amount
        };

        let _params = {};
        if (params.inception != null){
            _params["inception"] = params.inception;
        }
        if (params.expiration != null){
            _params["expiration"] = params.expiration;
        }
        issueRequest["params"] = _params;

        try {
            let response = await this.juicechain.requestPost("assets/nft", issueRequest, signature);
            if (response && response.success) {
                let asset: Asset = new Asset();
                asset = response.payload;
                return asset;
            }
            return null;
        } catch(exception) {
            return exception;
        }
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
            let response = await this.juicechain.requestPost("assets/parameters", params, "");
            if (response) {
                return response.success as boolean;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public async setCard(asset: string, filePath: string): Promise<boolean> {
        let data = await read(filePath);

        try {
            let response = await this.juicechain.requestUpload("assets/card", asset, data);
            if (response) {
                return response.success as boolean;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public async setMedia(asset: string, filePath: string): Promise<boolean> {
        let data = await read(filePath);

        try {
            let response = await this.juicechain.requestUpload("assets/media", asset, data);
            if (response) {
                return response.success as boolean;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }
}
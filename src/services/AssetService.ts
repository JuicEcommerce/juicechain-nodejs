import { JuicEchain } from "../JuicEchain";
import { Asset } from "../models/Asset"
import { AssetParams } from "../models/AssetParams"

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
            let response = await this.juicechain.requestPost("assets/", JSON.stringify(issueRequest), signature);
            let asset: Asset = new Asset();
            asset = response.payload; //check if properties match?
            return asset;
        } catch(exception) {
            return exception;
        }


    }

    public async issueNFT(name: string, receiver: string, content: string, params: AssetParams, 
                    amount: number, signature: string): Promise<Asset> { //throw exceptions
        
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

        //make request and return asset
        try {
            let response = await this.juicechain.requestPost("assets/nft", JSON.stringify(issueRequest), signature);
            if (response && response.success) {
                let asset: Asset = new Asset();
                asset = response.payload;
                return asset;
            }
            return null;
        } catch(error) {
            return error;
        }
    }

}
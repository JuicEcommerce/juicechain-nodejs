import { JuicEchain } from "../JuicEchain";
import { Asset } from "../models/Asset"
import { AssetParams } from "../models/AssetParams"

export class AssetService {

    private juicechain: JuicEchain;

    public AssetService(juicechain: JuicEchain) {
        this.juicechain = juicechain;
    }

    public issue(name: string, title: string, type: string, amount: number, //throw errors
                        targetAddress: string, publisher: string, signature: string): Asset {
        
        let _title = {"de_DE": title};

        let _options = {};
        _options["transferAll"] = true;
        _options["transferNode"] = true;
        _options["returnAddress"] = null;

        let issueRequest = {};
        issueRequest["name"] = name;
        issueRequest["title"] = _title;
        issueRequest["type"] = type;
        issueRequest["amount"] = amount;
        issueRequest["target"] = targetAddress;
        issueRequest["publisher"] = publisher;

        //get response and return asset
    }

    public issueNFT(name: string, receiver: string, content: string, params: AssetParams, 
                    amount: number, signature: string): Asset { //throw exceptions
        
        let issueRequest = {};
        issueRequest["name"] = name;
        issueRequest["receiver"] = receiver;
        issueRequest["content"] = content;
        issueRequest["amount"] = amount;

        let _params = {};
        if (params.inception != null){
            //need to format the date
            _params["inception"] = params.inception.toDateString();
        }
        if (params.expiration != null){
            //need to format the date
            _params["expiration"] = params.expiration.toString();
        }

        issueRequest["params"] = _params;

        //make request and return asset
    }


}
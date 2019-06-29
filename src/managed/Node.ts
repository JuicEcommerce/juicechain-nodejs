import {RequestHelper} from "../helpers/RequestHelper";
import {Asset} from "./Asset";
import {AssetParams} from "../models/AssetParams";
import {IssueRejectionError} from "../errors/IssueRejectionError";
import {Wallet} from "./Wallet";

export class Node {

    public node: string;
    private requestHelper: RequestHelper;

    constructor(node: string, username: string, apiKey: string) {
        this.node = node;
        this.requestHelper = new RequestHelper(node, username, apiKey);
    }

    public async createWallet(): Promise<Wallet> {
        let response = await this.requestHelper.requestPost("node/wallet", {});

        if (response && response.success) {
            const wallet: Wallet = new Wallet(this);
            wallet.parse(response.payload);
            return wallet;
        }

        return null;
    }


    public getWallet(privateKey: string, address: string, publicKey?: string): Wallet {
        const wallet = new Wallet(this);
        wallet.address = address;
        wallet.privateKey = privateKey;
        wallet.node = this.node;
        wallet.publicKey = publicKey;

        return wallet;
    }

    public async issue(name: string, title: string, type: string, amount: number,
                       targetAddress: string, publisher: string): Promise<Asset> {

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
            let response = await this.requestHelper.requestPost("node/asset", issueRequest);
            const asset: Asset = new Asset(this);
            asset.parse(response.payload);
            return asset;
        } catch (exception) {
            return exception;
        }
    }

    public async issueNFT(name: string, receiver: string, content: string, params: AssetParams,
                          amount: number, authentication: string): Promise<Asset> { //throw exceptions

        let issueRequest = {
            name: name,
            receiver: receiver,
            content: content,
            amount: amount
        };

        let _params = {};
        if (params.inception != null) {
            _params["inception"] = params.inception;
        }
        if (params.expiration != null) {
            _params["expiration"] = params.expiration;
        }
        issueRequest["params"] = _params;

        try {
            let response = await this.requestHelper.requestPost("node/nft", issueRequest, authentication);
            if (response.success) {
                const asset: Asset = new Asset(this);
                asset.parse(response.payload);
                return asset;
            } else {
                throw new IssueRejectionError(response.error);
            }
            return null;
        } catch (exception) {
            return exception;
        }

    }

    public request(): RequestHelper {
        return this.requestHelper;
    }

}

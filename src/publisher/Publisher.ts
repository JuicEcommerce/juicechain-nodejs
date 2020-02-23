import {Host} from "../core/Host";
import {Asset} from "../models/Asset";
import {ManagedAsset} from "./ManagedAsset";
import {ManagedWallet} from "./ManagedWallet";
import {IssueRejectionError} from "../core/errors/IssueRejectionError";

/**
 *  Managed Publisher
 */
export class Publisher {

    public host: Host;

    constructor(host: Host) {
        this.host = host;
    }

    public async createWallet(): Promise<ManagedWallet> {
        let response = await this.host.request().post("node/wallet", {});

        if (response && response.success) {
            const wallet: ManagedWallet = new ManagedWallet(this.host);
            wallet.parse(response.payload);
            return wallet;
        }

        return null;
    }

    public getWallet(privateKey: string, address: string, publicKey?: string): ManagedWallet {
        const wallet = new ManagedWallet(this.host);
        wallet.address = address;
        wallet.privateKey = privateKey;
        wallet.publicKey = publicKey;

        return wallet;
    }

    public async issue(name: string, title: string, type: string, amount: number,
                       targetAddress: string, publisher: string): Promise<ManagedAsset> {

        let _options = {
            transferAll: true,
            transferNode: true,
            returnAddress: null
        };

        let issueRequest = {
            name: name,
            title: title,
            type: type,
            amount: amount,
            target: targetAddress,
            publisher: publisher,
            options: _options
        };

        try {
            let response = await this.host.request().post("publisher/asset", issueRequest);
            const asset: ManagedAsset = new ManagedAsset(this);
            asset.parse(response.payload);
            return asset;
        } catch (exception) {
            throw new IssueRejectionError(exception.message);
        }
    }

    public async issueChild(name: string, receiver: string, content: string, params: any,
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
        if (params.transferable != null)
            _params["transferable"] = params.transferable;

        issueRequest["params"] = _params;

        try {
            let response = await this.host.request().post("publisher/asset/child", issueRequest, authentication);
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

    public getHost(): Host {
        return this.host;
    }

}
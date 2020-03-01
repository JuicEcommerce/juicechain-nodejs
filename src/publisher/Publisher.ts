import {Host} from "../core/Host";
import {Asset} from "../models/Asset";
import {ManagedAsset} from "./ManagedAsset";
import {ManagedWallet} from "./ManagedWallet";
import {IssueRejectionError} from "../core/errors/IssueRejectionError";
import {PublisherId} from "../core/types/PublisherId";
import {AssetId} from "../core/types/AssetId";
import {LocalizedString} from "../core/types/LocalizedString";

/**
 *  Managed Publisher
 */
export class Publisher {

    public host: Host;
    public id: PublisherId;

    constructor(host: Host, id: PublisherId) {
        this.host = host;
        this.id = id;
    }

    /**
     * Open new wallet from publisher
     *
     * @param transferLock
     */
    public async createWallet(transferLock: number): Promise<ManagedWallet> {
        let response = await this.host.request().post("publisher/wallet", {
            transferLock: transferLock
        });

        if (response && response.success) {
            const wallet: ManagedWallet = new ManagedWallet(this.host);
            wallet.parse(response.payload);
            return wallet;
        }

        return null;
    }

    /**
     * Create local Active Wallet
     *
     * @param privateKey
     * @param address
     * @param publicKey
     */
    public getWallet(privateKey: string, address: string, publicKey?: string): ManagedWallet {
        const wallet = new ManagedWallet(this.host);
        wallet.address = address;
        wallet.privateKey = privateKey;
        wallet.publicKey = publicKey;

        return wallet;
    }

    /**
     * Issue Asset
     *
     * @param id
     * @param title
     * @param type
     * @param amount
     * @param targetAddress
     * @param publisher
     */
    public async issue(id: AssetId, root: boolean, quantity: number, title: LocalizedString): Promise<ManagedAsset> {

        let issueRequest = {
            id: id,
            title: title,
            root: root,
            quantity: quantity
        };

        try {
            let response = await this.host.request().post("publisher/asset/" + id.getHex(), issueRequest);
            const asset: ManagedAsset = new ManagedAsset(this);
            asset.parse(response.payload);
            return asset;
        } catch (exception) {
            throw new IssueRejectionError(exception.message);
        }
    }

    /**
     * Issue child asset
     *
     * @param name
     * @param receiver
     * @param content
     * @param params
     * @param amount
     * @param authentication
     */
    public async issueChild(name: string, receiver: string, content: string, params: any,
                            amount: number, authentication: string): Promise<ManagedAsset> { //throw exceptions

        let issueRequest = {
            name: name,
            receiver: receiver,
            content: content,
            amount: amount
        };


        try {
            let response = await this.host.request().post("publisher/asset/issue-nft", issueRequest, authentication);
            if (response.success) {
                const asset: ManagedAsset = new ManagedAsset(this);
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
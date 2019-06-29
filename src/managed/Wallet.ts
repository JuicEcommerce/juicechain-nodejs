import {Message} from "../helpers/Message";
import {Balance} from "../models/Balance";
const bitcore = require('bitcore-lib');

import {Node} from "./Node";
import {NotFoundException} from "../errors/NotFoundException";
import {Asset} from "./Asset";

export class Wallet {

    public node: string;
    public title: string;
    public privateKey: string;
    public publicKey: string;
    public address: string;
    public provider: string;

    private _node: Node;

    constructor(node: Node){
        this._node = node;
    }

    /**
     * Generate short-live token based on private key
     *
     * @param privateKey
     * @param device
     * @param asset
     * @param address
     * @returns {string}
     */
    public getAuthentication(asset?: string, validation?: Date): string {

        const _privateKey = bitcore.PrivateKey.fromWIF(this.privateKey);
        const payload:any = {
            address: this.address,
            device: null,
            asset: asset,
            timestamp: (validation) ? validation : (new Date()),
        };

        // generate signature
        const message = new Message(JSON.stringify(payload));
        const signature = message.sign(_privateKey);

        // generate message
        payload.signature = signature;

        return Buffer.from(JSON.stringify(payload)).toString("base64");
    };

    /**
     * Load Asset
     *
     * @param name Name of asset
     * @return Asset
     *
     * @throws NotAuthorizedException
     * @throws IOException
     * @throws NotFoundException
     * @throws ParseException
     */
    async getAsset(name: string):Promise<Asset> {

        try {
            let response = await this._node.request().requestPost("node/asset/details", {
                name: name
            });
            if (response && response.success) {
                const asset = new Asset(this._node);
                asset.parse(response.payload);
                return asset;
            }
            return null;
        } catch(exception) {
            throw new NotFoundException("Invalid Asset");
        }

    }

    public async getBalance(minconf: number): Promise<Balance[]> {
        let balances: Balance[] = null;

        try {
            let response = await this._node.request().requestGet("/node/wallet/" + this.address + "/" + minconf + "/" + "/ACV");
            if (response && response.success) {
                balances = [];
                for (let _balance of response.payload) {
                    _balance.updated = new Date();
                    balances.push(_balance);
                }
                return balances;
            }
            return null;
        } catch(exception) {
            return exception;
        }
    }

    public async transfer(receiverAddress: string, asset: string, quantity: number, payload: string): Promise<boolean> {

        let body = {
            asset: asset,
            amount: quantity,
            payload: payload
        };

        const authentication = this.getAuthentication();

        try {
            let response = await this._node.request().requestPost("node/wallet/transfer/" + receiverAddress, body, authentication);
            if (response && response.success) {
                return true;
            }
            return null; //failed transfer
        } catch(exception) {
            return exception;
        }
    }

    public parse(json: any){
        this.privateKey = json.privateKey;
        this.publicKey = json.publicKey;
        this.address = json.address;
        this.node = json.node;
        this.provider = json.provider;
        this.title = json.title;
    }

}

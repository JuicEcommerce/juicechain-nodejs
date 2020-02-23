import * as https from "https";
import {Host} from "../core/Host";
import {Asset} from "../models/Asset";
import {Wallet} from "../models/Wallet";
import {Balance} from "../core/types/Balance";
import {AssetId} from "../core/types/AssetId";
import {Address} from "../core/types/Address";


/**
 * Wallet hosted by an off-shore server
 *
 */
export class HostedWallet extends Wallet{

    private host: Host;

    constructor(host: Host, address: string, privateKey: string, publicKey?: string){
        super(address, privateKey, publicKey);
        this.host = host;
    }

    /**
     * Fetch balance (quantity of all assets) in this wallet
     *
     */
    public async balance(offset?: number):Promise<Array<Balance>>{

        const command = this.host.createCommand("balance", {
            offset: offset
        }, this.createSignedToken());

        const result = await command.execute();

        if (result.success) {
            return <Array<Balance>> result.payload
        } else {
            throw new Error("Failed getting wallet from node");
        }
    }

    /**
     * Transfer Asset to another wallet
     *
     * @param receiver
     * @param asset
     * @param quantity
     */
    public async transfer(receiver: Address, assetId: AssetId, quantity: number):Promise<boolean> {

        const command = this.host.createCommand("transfer", {
            receiver: receiver,
            asset: assetId,
            quantity: quantity
        }, this.createSignedToken());
        const result = await command.execute();

        if (result.success) {
            return true;
        } else {
            throw new Error(JSON.stringify(result.error));
        }
    }

    /**
     * Safe exchange wallet address via host
     *
     * @param code
     */
    public async exchange(hostUrl: string, code: string):Promise<boolean>{
        const targetHost = new Host(hostUrl);
        const command = targetHost.createCommand("exchange", {
            code: code
        }, this.createSignedToken());
        const result = await command.execute();

        if (result.success) {
            return true;
        } else {
            throw new Error("Failed to submit address");
        }
    }

    /**
     * Submits wallet address to link in code
     *
     * @param address
     * @param asset
     */
    public request(url: string, code: string):Promise<{ success: boolean, transfer?: boolean, error: any }>{

        // create url
        const _url = new URL(url + "/" + code + "/" + this.address);

        const options = {
            hostname: _url.hostname,
            path: _url.pathname,
            port: 443,
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            }
        };

        return new Promise((resolve, reject) => {
            let data = '';

            // @ts-ignore
            const req = https.request(options, (res) => {
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try{
                        const content = JSON.parse(data);
                        resolve(content);
                    } catch (exception){
                        resolve({
                            success: false,
                            error: exception.message
                        })
                    }
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    error: error
                });
            });

            req.end();

        });

    }

    /**
     * Load asset details
     *
     * @param node
     * @param address
     * @param name
     */
    public async getAsset(assetId: AssetId):Promise<Asset> {

        const command = this.host.createCommand("details",
            {
                id: assetId
            }, this.createSignedToken());

        const result = await command.execute();

        if (result.success) {
            return new Asset(result.payload);
        } else {
            throw new Error("Failed fetching asset updated");
        }

    }

    /**
     * Charge
     *
     * Allowance:
     * {
     *     node: "node",
     *     asset: "asset",
     *     amount: "number",
     *     sender: "",
     *     timestamp: "",
     *     signature: ""
     * } => Base64
     *
     * @param allowance
     */
    public async charge(allowance: string): Promise<any>{
        // extract node
        const plain = Buffer.from(allowance, 'base64');
        const payload = JSON.parse(plain.toString("ascii"));

        const targetNode = new Host(payload.node, "");
        const command = this.host.createCommand("charge", {
                allowance: allowance
            }, this.createSignedToken());

        return await command.execute();
    }


    /**
     * Parse wallet json
     *
     * @param walletDetails
     */
    public parse(walletDetails: any) {
        this.logo      = walletDetails.logo;
        this.publisher = walletDetails.publisher;
        this.title     = walletDetails.title;
        this.theme     = walletDetails.theme;
    }

}

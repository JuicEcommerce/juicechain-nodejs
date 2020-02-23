import {Host} from "../core/Host";
import {Balance} from "../core/types/Balance";

export class ManagedWallet {

    public title: string;
    public address: string;
    public publisher: string;
    public publicKey: string;
    public privateKey: string;

    private _host: Host;

    constructor(host: Host){
        this._host = host;
    }


    setTransferLock(transferLock: number){
        throw new Error("Not Implemented");
    }

    whitelist(address: string, targetPublisher: string, listed: boolean){
        throw new Error("Not Implemented");
    }

    blacklist(address: string, targetPublisher: string, listed: boolean) {
        throw new Error("Not Implemented");
    }

    /**
     * Fetch all Assets in wallet
     */
    public async balance(): Promise<Balance[]> {
        let balances: Balance[] = null;

        try {
            let response = await this._host.request().get("wallet/balance" + this.address);
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


    public parse(json: any){
        this.title = json.title;
        this.address = json.address;
        this.publicKey = json.publicKey;
        this.publisher = json.publisher;
        this.privateKey = json.privateKey;
    }

    public toJSON(){
        return {
            title: this.title,
            address: this.address,
            publicKey: this.publicKey,
            publisher: this.publisher,
            privateKey: this.privateKey
        }
    }

}

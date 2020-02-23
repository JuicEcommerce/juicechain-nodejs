import {Command} from "./provider/Command";
import {Request} from "./provider/Request";
import {PublisherId} from "./types/PublisherId";
import {HostedWallet} from "../wallet/HostedWallet";
import {ManagedWallet} from "../publisher/ManagedWallet";

export class Host {

    private url: string;
    private username: string;
    private key: string;

    constructor(url: string, username?: string, key?: string) {
        this.url = url;
        this.username = username;
        this.key = key;
    }

    async isAvailable(): Promise<boolean>{
        let response = await this.request().get("status", false);

        if (response && response.success) {
            return true
        } else {
            return false;
        }
    }

    /**
     * Request new wallet from node
     *
     * @param publisher
     * @param lockMode
     */
    public async createWallet(publisher: PublisherId, lockMode = 0):Promise<HostedWallet>{
        const command = this.createCommand("create", {
            publisherId: publisher,
            lockMode: lockMode
        }, null);
        const result = await command.execute();

        if (result.success){
            const wallet = new HostedWallet(this, result.payload.address, result.payload.privateKey);
            wallet.parse(result.payload);
            return wallet;
        } else {
            throw new Error("Failed getting wallet from node");
        }
    }

    /**
     * Restore existing wallet on VirtualNode
     * @param host
     * @param address
     * @param privateKey
     */
    public async restoreWallet(host: string, address: string, privateKey: string):Promise<HostedWallet>{
        const _wallet = new HostedWallet(this, address, privateKey);
        const command = this.createCommand("restore", {},
            _wallet.createSignedToken());
        const result = await command.execute();

        if (result.success){
            _wallet.parse(result.payload);
            return _wallet;
        } else {
            throw new Error("Failed getting wallet from node");
        }
    }


    request(): Request {
        return new Request(this.url, this.username, this.key);
    }

    /**
     * Create command, bases on the vNode
     *
     * @param command
     * @param payload
     * @param authentication
     */
    public createCommand(command: string, payload: any, authentication: string): Command {
        return new Command(command, payload, authentication, this.url, this.key);
    }

}
import { Node } from "./managed/Node";
import { AssetService } from "./services/AssetService";
import { WalletService } from "./services/WalletServices";
import { Address } from "./core/types/Address";
import { AssetIdHex } from "./core/types/AssetIdHex";
import { IAccount } from "./core/IAccount";
import { EthereumService } from "../sdk/EthereumService";
import { PublisherService } from "./services/PublisherService";
import { ConsortiumService } from "./services/ConsortiumService";

export class JuicEchain {

    asset: AssetService;
    wallet: WalletService;
    publisher: PublisherService;
    consortium: ConsortiumService;
    etheriumService: EthereumService;


    constructor(chainId, chainEndpoint) {
        this.etheriumService = new EthereumService(chainId, chainEndpoint);
        this.asset = new AssetService(chainId, chainEndpoint);
        this.wallet = new WalletService(chainId, chainEndpoint);
        this.publisher = new PublisherService(chainId, chainEndpoint);
        this.consortium = new ConsortiumService(chainId, chainEndpoint);
    }

    public async transfer(recipient: Address, assetId: AssetIdHex, amount: number,
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.transfer(recipient, assetId, amount, sender, confirm);

    }

}

import { PublisherId } from "../core/types/PublisherId";
import { IAccount } from "../core/IAccount";
import { Result } from "../core/types/Result";
import { Address } from "../core/types/Address";
import { AssetIdHex } from "../core/types/AssetIdHex";
import { EthereumService } from "../native/EthereumService";

export class WalletService {

    etheriumService: EthereumService;

    constructor(chainId, chainEndpoint) {
        this.etheriumService = new EthereumService(chainId, chainEndpoint);
    }

    public async open(publisherId: PublisherId, address: string, transferLock: number,
        sender: IAccount, confirm: boolean = true): Promise<Result<any>> {

        return await this.etheriumService.open(publisherId, address, transferLock, sender, confirm);

    }


    public async transfer(recipient: Address, assetId: AssetIdHex, amount: number,
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.transfer(recipient, assetId, amount, sender, confirm);

    }


    public async getAssetBalance(address: Address, assetId: AssetIdHex, sender: IAccount): Promise<number> {

        return await this.etheriumService.getAssetBalance(address, assetId, sender);

    }

    public async getBalance(address: string, offset: number, sender: IAccount): Promise<{
        count: number,
        assets: Array<{ id: string, quantity: number }>
    }> {

        return await this.etheriumService.getBalance(address, offset, sender);

    }


    public async getWallet(address: string, sender: IAccount): Promise<any> {

        return await this.etheriumService.getWallet(address, sender);

    }


    public async hasAsset(address: string, assetId: string, sender: IAccount): Promise<boolean> {

        return await this.etheriumService.hasAsset(address, assetId, sender);

    }


    public async whitelist(address: string, targetedPublisherId: PublisherId, listed: boolean,
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.whitelist(address, targetedPublisherId, listed, sender, confirm);

    }


    public async blacklist(address: string, targetedPublisherId: PublisherId, listed: boolean,
        sender: IAccount, confirm: boolean = true): Promise<any> {


        return await this.etheriumService.blacklist(address, targetedPublisherId, listed, sender, confirm);

    }


    public async setTransferlock(address: string, transferLock: number,
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.setWalletTransferLock(address, transferLock, sender, confirm);

    }


    public async setActive(address: string, active: boolean, 
        sender: IAccount, confirm: boolean = true): Promise<any> {
       
        return await this.etheriumService.setAccountActive(address, active, sender, confirm);

    }

}
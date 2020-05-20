import { AssetIdHex } from '../core/types/AssetIdHex';
import { IAccount } from '../core/IAccount';
import { Address } from '../core/types/Address';
import { ChainAssetData } from '../models/ChainAssetData';
import { AssetId } from '../core/types/AssetId';
import { EthereumService } from '../native/sdk/EthereumService';

export class AssetService {

    etheriumService: EthereumService;

    constructor(chainId, chainEndpoint) {
        this.etheriumService = new EthereumService(chainId, chainEndpoint);
    }

    public async issue(assetId: AssetIdHex, root: boolean,
        amount: number, publisher: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.issue(assetId, root, amount, publisher, confirm);

    }

    public async issueNFA(assetid: AssetIdHex, recipient: Address,
        publisher: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.issueNFA(assetid, recipient, publisher, confirm);

    }

    public async getAsset(assetId: AssetIdHex, sender: IAccount): Promise<ChainAssetData> {

        const asset: ChainAssetData = await this.etheriumService.getAsset(assetId, sender);
        return asset;

    }

    public async setActive(assetId: AssetIdHex, active: boolean,
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.setAssetActive(assetId, active, sender, confirm);
    }


    public async exists(assetId: AssetIdHex, sender: IAccount): Promise<boolean> {

        return await this.etheriumService.assetExists(assetId, sender);

    }

    public async isRoot(assetId: AssetIdHex, sender: IAccount): Promise<boolean> {

        return await this.etheriumService.isRootAsset(assetId, sender);

    }

    public async isActive(assetId: AssetIdHex, sender: IAccount): Promise<boolean> {

        return await this.etheriumService.isAssetActive(assetId, sender);

    }

    public async setTransferlock(assetId: AssetId, transferLock: number,
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.setAssetTransferLock(assetId, transferLock, sender, confirm);

    }

    public async setValidation(assetId: AssetId, validation: number, 
        sender: IAccount, confirm: boolean = true): Promise<any>{

        return await this.etheriumService.setValidation(assetId, validation, sender, confirm);

    }

    public async setChecksum(assetId: AssetId, checksum: any, sender: IAccount, confirm: boolean = true): Promise<any>{

        return await this.etheriumService.setChecksum(assetId, checksum, sender, confirm);

    }
}
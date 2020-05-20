import { EthereumService } from '../../sdk/EthereumService';
import { IAccount } from '../core/IAccount';
import { PublisherId } from '../core/types/PublisherId';
import { Address } from '../core/types/Address';

export class PublisherService {

    etheriumService: EthereumService;

    constructor(chainId, chainEndpoint) {
        this.etheriumService = new EthereumService(chainId, chainEndpoint);
    }

    public async create(publisherId: PublisherId, address: string, 
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.createPublisher(publisherId, address, sender, confirm);

    }

    public async get(publisherId: PublisherId, sender: IAccount): Promise<any> {

        return await this.etheriumService.getPublisher(publisherId, sender);

    }

    public async isOwner(publisherId: PublisherId, address: string, sender?: IAccount): Promise<any> {

        return await this.etheriumService.isOwner(publisherId, address, sender);

    }

    public async setActive(publisherId: PublisherId, active: boolean, 
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.setPublisherActive(publisherId, active, sender, confirm);

    }

    public async setChecksum(publisherId: PublisherId, checksum: any, 
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.setPublisherChecksum(publisherId, checksum, sender, confirm);

    }

    public async setHosts(publisherId: PublisherId, host1: any, host2: any, 
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.setPublisherHosts(publisherId, host1, host2, sender, confirm);

    }

    public async transferOwnership(publisherId: PublisherId, newOwnerAddress: Address, 
        sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.transferPublisher(publisherId, newOwnerAddress, sender, confirm);

    }

    public async getOwner(publisherId: PublisherId, sender: IAccount): Promise<any> {

        return await this.etheriumService.getPublisherOwner(publisherId, sender);

    }

    public async isAvailable(publisherId: PublisherId, sender: IAccount): Promise<any> {

        return await this.etheriumService.isPublisherAvailable(publisherId, sender);

    }
    
}
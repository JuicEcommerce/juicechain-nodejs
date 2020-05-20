import { IAccount } from '../core/IAccount';
import { EthereumService } from '../native/sdk/EthereumService';

export class ConsortiumService {

    etheriumService: EthereumService;

    constructor(chainId, chainEndpoint) {
        this.etheriumService = new EthereumService(chainId, chainEndpoint);
    }

    public async vote(memberAddress: string, vote: boolean, sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.vote(memberAddress, vote, sender, confirm);

    }

    public async getSize(sender: IAccount): Promise<any> {

        return await this.etheriumService.getSize(sender);

    }

    public async getMembers(sender: IAccount): Promise<any> {

        return await this.etheriumService.getMembers(sender);

    }

    public async isMember(address: string, sender: IAccount): Promise<any> {

        return await this.etheriumService.isMember(address, sender);

    }

    public async voteOpenFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.voteOpenFee(amount, sender, confirm);

    }

    public async voteIssueFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.voteIssueFee(amount, sender, confirm);

    }

    public async voteTransferFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.voteTransferFee(amount, sender, confirm);

    }

    public async voteUpdateFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.voteUpdateFee(amount, sender, confirm);

    }

    public async votePublishersFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {

        return await this.etheriumService.voteUpdateFee(amount, sender, confirm);

    }

}
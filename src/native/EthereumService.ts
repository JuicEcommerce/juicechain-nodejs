import {ContractHelper} from "./ContractHelper";
import { IAccount } from "../core/IAccount";
import { Result } from "../core/types/Result";
import { PublisherId } from "../core/types/PublisherId";
import { Address } from "../core/types/Address";
import { AssetIdHex } from "../core/types/AssetIdHex";
import { AssetId } from "../core/types/AssetId";

const consortiumAbi = require("./abi/Consortium").abi;
const publisherAbi = require("./abi/Publishers").abi;
const assetsAbi = require("./abi/Assets").abi;
const orangeAbi = require("./abi/Orange").abi;
const juiceAbi = require("./abi/Juice").abi;

const config = require("./config.json");
const Web3 = require("web3");

export class EthereumService {

    private web3: any;

    private chainId;

    constructor(chainId, chainEndpoint) {
        this.chainId = chainId;
        this.web3 = new Web3(new Web3.providers.HttpProvider(chainEndpoint));
        this.web3.eth.handleRevert = true;
    }

    public createLocalAccount(): IAccount{
        return this.web3.eth.accounts.create();
    }

    // -----------------------------------------------------------------------------------------------
    // ------------------------------------ Juice ----------------------------------------------------

    /**
     * Send Juice
     * @param recipient
     * @param juice
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async send(recipient: string, juice: string, sender: IAccount, confirm: boolean = true): Promise<Result<any>> {
        //Logging.debug("Ethereum", "Send (" + sender.address + ") [" + parseInt(juice)  + "]");
        const Juicecoin = this.getJuice(sender);
        return await Juicecoin.send("transfer", [recipient, parseInt(juice)], confirm);
    }

    /**
     * Get Juice balance of address (not account)
     * @param address
     * @param sender
     */
    public async balanceOf(address: string, sender: IAccount): Promise<string> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Juicecoin = this.getJuice(sender);
        return await Juicecoin.call("balanceOf", [address]);
    }


    // ------------------------------------------------------------------------------------------------
    // ------------------------------------ Consortium ------------------------------------------------


    /**
     * Voting for adding or removing member of Consortium.
     * @param memberAddress
     * @param vote
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async vote(memberAddress: string, vote: boolean, sender: IAccount, confirm: boolean = true): Promise<any> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.send("vote", [memberAddress, vote], confirm);
    }

    /**
     * Get count of consortium members.
     * @param sender
     */
    public async getSize(sender: IAccount): Promise<string> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.call("getSize", []);
    }

    /**
     * Get array of members addresses.
     * @param sender
     */
    public async getMembers(sender: IAccount): Promise<string> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.call("getMembers", []);
    }

    /**
     * Get positive votes of member address.
     * @param address
     * @param sender
     */
    public async getMemberVote(address: string, sender: IAccount): Promise<string> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.call("getMemberVote", [address]);
    }

    /**
     * Check if address is a member of the Consortium.
     * @param address
     * @param sender
     */
    public async isMember(address: string, sender: IAccount): Promise<string> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.call("isMember", [address]);
    }

    /**
     * Vote for open fee amount.
     * Only executeable by a member of the Consortium.
     * @param amount
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async voteOpenFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.send("voteOpenFee", [amount], confirm);
    }

    /**
     * Vote for issue fee amount.
     * Only executeable by a member of the Consortium.
     * @param amount
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async voteIssueFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.send("voteIssueFee", [amount], confirm);
    }

    /**
     * Vote for transfer fee amount.
     * Only executeable by a member of the Consortium.
     * @param amount
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async voteTransferFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.send("voteTransferFee", [amount], confirm);
    }

    /**
     * Vote for update fee amount.
     * Only executeable by a member of the Consortium.
     * @param amount
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async voteUpdateFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.send("voteUpdateFee", [amount], confirm);
    }

    /**
     * Vote for publisher fee amount.
     * Only executeable by a member of the Consortium.
     * @param amount
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async votePublishersFee(amount: number, sender: IAccount, confirm: boolean = true): Promise<any> {
        //Logging.debug("Ethereum", "Balance (" + sender.address + ")");
        const Consortium = this.getConsortium(sender);
        return await Consortium.send("votePublisherFee", [amount], confirm);
    }
    // ------------------------------------------------------------------------------------------------
    // --------------------------------- Publisher ----------------------------------------------------

    /**
     * Create a new publisher and make wallet for new created publisher.
     * @param publisherId
     * @param address
     * @param sender
     */
    public async createPublisher(publisherId: PublisherId, address: string, sender: IAccount, confirm: boolean = true): Promise<Result<any>>{
        //Logging.debug("Ethereum", "Publisher (" + address + ")");

        // call contract and create publisher
        const Publisher = this.getPublishers(sender);
        const result = await Publisher.send("create", [publisherId, address], confirm);
        if (!result.success){
            return result;
        }

        // create publishers wallet (first)
        const wallet = await this.open(publisherId, address, 0, sender, confirm);
        if (!wallet.success){
            return wallet;
        }

        return { success: true };
    }

    /**
     * Get publishers info.
     * @param publisherId
     * @param sender
     */
    public async getPublisher(publisherId: PublisherId, sender: IAccount): Promise<any> {
        const Publisher = this.getPublishers(sender);
        return await Publisher.call("get", [publisherId]);
    }

    /**
     * Check if given address is a owner of an publisher.
     * @param publisherId
     * @param address
     * @param sender
     */
    public async isOwner(publisherId: PublisherId, address: string, sender?: IAccount): Promise<boolean>{
        //const _id = this.web3.utils.fromAscii(publisherId);
        return await this.getPublishers(sender).call("isOwner", [publisherId.toString(), address]);
    }

    /**
     * Set active property of a publisher.
     * Only executeable by a publisher or owner.
     * @param publisherId
     * @param active
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async setPublisherActive(publisherId: PublisherId, active: boolean, sender: IAccount, confirm: boolean = true): Promise<any>{
        const Publishers = this.getPublishers(sender);
        return await Publishers.send("setActive", [publisherId, active], confirm);
    }
 
    /**
     * Set checksum.
     * Only executeable by a publisher or owner.
     * @param publisherId
     * @param checksum
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async setPublisherChecksum(publisherId: PublisherId, checksum: any, sender: IAccount, confirm: boolean = true): Promise<any>{
        const Publishers = this.getPublishers(sender);
        return await Publishers.send("setChecksum", [publisherId, checksum], confirm);
    }

    /**
     * Set hosts for the publisher.
     * Only executeable by a publisher or owner.
     * @param publisherId
     * @param host1
     * @param host2
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async setPublisherHosts(publisherId: PublisherId, host1: any, host2: any, sender: IAccount, confirm: boolean = true): Promise<any>{
        const Publishers = this.getPublishers(sender);
        return await Publishers.send("setHosts", [publisherId, host1, host2], confirm);
    }

    /**
     * Transfer publisher to another owner.
     * Only executeable by a owner.
     * @param publisherId
     * @param newOwnerAddress
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async transferPublisher(publisherId: PublisherId, newOwnerAddress: Address, sender: IAccount, confirm: boolean = true): Promise<any>{
        const Publishers = this.getPublishers(sender);
        return await Publishers.send("transfer", [publisherId, newOwnerAddress], confirm);
    }

    /**
     * Get publishers owner address.
     * @param publisherId
     * @param sender
     */
    public async getPublisherOwner(publisherId: PublisherId, sender: IAccount): Promise<Result<any>> {
        const Publisher = this.getPublishers(sender);
        return await Publisher.call("getOwner", [publisherId]);
    }

    /**
     * Check if publisher is available.
     * @param publisherId
     * @param sender
     */
    public async isPublisherAvailable(publisherId: PublisherId, sender: IAccount): Promise<Result<any>> {
        const Publisher = this.getPublishers(sender);
        return await Publisher.call("isAvailable", [publisherId]);
    }

    // ------------------------------------------------------------------------------------------------
    // ------------------------------------ Assets ----------------------------------------------------

    /**
     * Create new digital asset and store it to the publisher wallet.
     * Only executeable by a publisher.
     * @param assetId
     * @param root
     * @param amount
     * @param publisher
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async issue(assetId: AssetIdHex, root: boolean, amount: number, publisher: IAccount, confirm: boolean = true): Promise<any>{
        //Logging.debug("Ethereum", "Issue (" + id + ") [" + publisher.address + "]");

        const result = await this.getAssets(publisher).send(
            "issue",
            [assetId.toString(), root, amount, config.contracts.orange],
            confirm
        );

        return result;
    }

    /**
     * Create new Non-Fungible Asset and store it to the recipients wallet.
     * Only executeable by a publisher.
     * @param assetId
     * @param recipient
     * @param publisher
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async issueNFA(assetid: AssetIdHex, recipient: Address, publisher: IAccount, confirm: boolean = true): Promise<any> {
        //Logging.debug("Ethereum", "IssueNFT (" + rootAssetid + ") [" + publisher.address + "]");

        const result = await this.getAssets(publisher).send(
            "issueNFA",
            [assetid, recipient],
            confirm
        )

        return result;
    }


    /**
     * Activate and deactivate assets.
     * Only executeable by asset owner.
     * @param assetId
     * @param active
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async setAssetActive(assetId: AssetIdHex, active: boolean, sender: IAccount, confirm: boolean = true): Promise<any>{
        const Assets = this.getAssets(sender);
        return await Assets.send("setActive", [assetId, active], confirm);
    }

    /**
     * Check if asset exists.
     * @param assetId
     * @param sender
     */
    public async assetExists(assetId: AssetIdHex, sender: IAccount): Promise<boolean>{
        const Assets = this.getAssets(sender);
        return await Assets.call("exists", [assetId]);
    }

    /**
     * Check if asset is root asset.
     * @param assetId
     * @param sender
     */
    public async isRootAsset(assetId: AssetIdHex, sender: IAccount): Promise<boolean>{
        const Assets = this.getAssets(sender);
        return await Assets.call("isRoot", [assetId]);
    }

    /**
     * Check if asset is active.
     * @param assetId
     * @param sender
     */
    public async isAssetActive(assetId: AssetIdHex, sender: IAccount): Promise<boolean>{
        const Assets = this.getAssets(sender);
        return await Assets.call("isActive", [assetId]);
    }

    // ------------------------------------------------------------------------------------------------
    // ------------------------------------ Orange ----------------------------------------------------

    /**
     * Open new wallet on the network issued by publisher.
     * @param publisherId
     * @param address
     * @param transferLock
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async open(publisherId: PublisherId, address: string, transferLock: number, sender: IAccount, confirm: boolean = true): Promise<Result<any>>{
        //Logging.debug("Ethereum", "Open (" + address + ") [" + id + "]");

        const Orange = this.getOrange(sender);
        const wallet = await Orange.send("open", [publisherId, address, transferLock], confirm);
        if (!wallet.success){
            return wallet;
        }

        return { success: true };
    }

    /**
     * Transfer asset to given wallet address.
     * @param recipient
     * @param assetId
     * @param amount
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async transfer(recipient: Address, assetId: AssetIdHex, amount: number, sender: IAccount, confirm: boolean = true): Promise<any>{
        //Logging.debug("Ethereum", "Transfer (" + recipient + ") [" + assetId + "]");

        return await this.getOrange(sender).send("transfer", [recipient, assetId, amount], confirm);
    }

    /**
     * Get balance of an asset in wallet.
     * @param address
     * @param assetId
     * @param sender
     */
    public async getAssetBalance(address: Address, assetId: AssetIdHex, sender: IAccount,):Promise<number>{
        const result = await this.getOrange(sender).call(
            "getAssetBalance",
            [assetId, address]
        )

        return parseInt(result);
    }

    /**
     * Get balance of 10 assets in wallet.
     * @param address
     * @param offset
     * @param sender
     */
    public async getBalance(address: string, offset: number, sender: IAccount): Promise<{ count: number, assets: Array<{ id: string, quantity: number }>}> {
        const balance = await this.getOrange(sender).call("getBalance", [address, offset]);

        return {
            count: parseInt(balance[1]),
            assets: balance[0].reduce((result, entry) => {
                if (entry[1] != 0)
                    result.push({
                        id: entry[0],
                        quantity: parseInt(entry[1])
                    });
                return result;
            }, [])
        };
    }

    /**
     * Get wallet information.
     * @param address
     * @param sender
     */
    public async getWallet(address: string, sender: IAccount): Promise<any>{
        return await this.getOrange(sender).call("getAccount", [address]);
    }

    /**
     * Get asset information.
     * @param address
     * @param sender
     */
    public async getAsset(asssetId: AssetIdHex, sender: IAccount): Promise<any> {
        const asset = await this.getOrange(sender).call("getAsset", [asssetId]);
        return {
            active: asset.active,
            root: asset.root,
            quantity: parseInt(asset.quantity),
            nfaLimit: parseInt(asset.nfaLimit),
            nfaQuantity: parseInt(asset.nfaQuantity),
            validation: parseInt(asset.validation),
            created: asset.created,
            chargeable: asset.chargeable,
            transferLock: asset.transferLock,
            checksum: asset.checksum,
            network: asset.network,
        };
    }


    /**
     * Check if wallet has an asset.
     * @param address
     * @param assetId
     * @param sender
     */
    public async hasAsset(address: string, assetId: string, sender: IAccount): Promise<boolean> {

        const result = await this.getOrange(sender).call(
            "getAssetBalance",
            [assetId, address]
        )

        return result > 0;
    }

    /**
     * Change transfer lock on an asset
     * @param assetId
     * @param transferLock
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async setAssetTransferLock(assetId: AssetId, transferLock: number, sender: IAccount, confirm: boolean = true): Promise<any>{
        const orange = this.getOrange(sender);
        return await orange.send("setAssetTransferLock", [assetId, transferLock], confirm);
    }

    /**
     * Set validation property on asset
     * @param assetId
     * @param validation
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async setValidation(assetId: AssetId, validation: number, sender: IAccount, confirm: boolean = true): Promise<any>{
        const orange = this.getOrange(sender);
        return await orange.send("setValidation", [assetId, validation], confirm);
    }

    /**
     * Set checksum
     * @param assetId
     * @param validation
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async setChecksum(assetId: AssetId, checksum: any, sender: IAccount, confirm: boolean = true): Promise<any>{
        const orange = this.getOrange(sender);
        return await orange.send("setChecksum", [assetId, checksum], confirm);
    }

    /**
     * Whitelist publisher for given acount
     * @param address
     * @param targetedPublisherId
     * @param listed
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async whitelist(address: string, targetedPublisherId: PublisherId, listed: boolean, sender: IAccount, confirm: boolean = true): Promise<any>{
        const orange = this.getOrange(sender);
        return await orange.send("whitelist", [address, targetedPublisherId, listed], confirm);
    }

    /**
     * Blacklist publisher for given acount
     * @param address
     * @param targetedPublisherId
     * @param listed
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async blacklist(address: string, targetedPublisherId: PublisherId, listed: boolean, sender: IAccount, confirm: boolean = true): Promise<any>{
        const orange = this.getOrange(sender);
        return await orange.send("blacklist", [address, targetedPublisherId, listed], confirm);
    }

    /**
     * Set transferlock property for account
     * @param address
     * @param transferLock
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async setWalletTransferLock(address: string, transferLock: number, sender: IAccount, confirm: boolean = true): Promise<any>{
        const orange = this.getOrange(sender);
        return await orange.send("setAccountTransferLock", [address, transferLock], confirm);
    }

    /**
     * Activate or deactivate account
     * @param address
     * @param active
     * @param sender
     * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
     */
    public async setAccountActive(address: string, active: boolean, sender: IAccount, confirm: boolean = true): Promise<any>{
        const orange = this.getOrange(sender);
        return await orange.send("setActive", [address, active], confirm);
    }

    // -------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------

    private getConsortium(sender: IAccount): ContractHelper {
        return new ContractHelper(consortiumAbi, config.contracts.consortium, this.web3, sender, this.chainId);
    }

    private getJuice(sender: IAccount): ContractHelper{
        return new ContractHelper(juiceAbi, config.contracts.juice, this.web3, sender, this.chainId);
    }

    private getPublishers(sender: IAccount): ContractHelper{
        return new ContractHelper(publisherAbi, config.contracts.publishers, this.web3, sender, this.chainId);
    }

    private getAssets(sender: IAccount): ContractHelper {
        return new ContractHelper(assetsAbi, config.contracts.assets, this.web3, sender, this.chainId);
    }

    private getOrange(sender: IAccount): ContractHelper {
        return new ContractHelper(orangeAbi, config.contracts.orange, this.web3, sender, this.chainId);
    }

}

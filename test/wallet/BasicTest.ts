import {expect} from "chai";
import {JuicEchain} from "../../src/JuicEchain";
import {PublisherId} from "../../src/core/types/PublisherId";
import {AssetId} from "../../src/core/types/AssetId";
import {HostedWallet} from "../../src/wallet/HostedWallet";

const sourceWallet = {
    privateKey: "0xa273e4ca0be8993d2b54b81ee4bde73c598802012979e6d9a9f24dce39a93820",
    publicKey: "U2FsdGVkX18yOQjUYy7YZpUVd7WDqk0VMgCpSCxXGm8=",
    address: "0x2475733403f8a94aA8A09d5920b05c65308b12a5",
};
const publisherId: PublisherId = "0x6d676970696e7a78";
const assetId: AssetId = "0x6d676970696e7a78746573743a41737365743a31353831393633373137363139";
const {hostUri, key} = process.env;

var demoHost;
var hostedWallet;
var localWallet;

/**
 *  Testing Hosted Wallet
 */
describe('Create wallet', () => {

    it('Connect to Host', async () => {
        demoHost = JuicEchain.getHost(hostUri);
        const status = await demoHost.isAvailable();

        expect(status).to.be.true;
    });

    it('Request new Wallet', async () => {
        hostedWallet = await demoHost.createWallet(publisherId);

        expect(hostedWallet).to.not.be.null;
        expect(hostedWallet.address).to.not.be.null;
    }).timeout(20000);

    it('Create wallet with keys', async () => {
        localWallet = new HostedWallet(demoHost, sourceWallet.address, sourceWallet.privateKey)
    });

    it("Fetch balance", async () => {
        let balance = await localWallet.balance();

        expect(balance.length).to.be.greaterThan(0);
    });

    it("Fetch asset details", async () => {
        const asset = await localWallet.getAsset(assetId);

        expect(asset).to.not.be.null;
        expect(asset.id).to.equal(assetId);
    });

    it("Transfer asset", async () => {
        const result = await localWallet.transfer(hostedWallet.address, assetId, 1);

        expect(result).to.be.true;

        const balance = await hostedWallet.balance();
        expect(balance.length).to.equal(1);
    }).timeout(5000);;

    it("Verify ownership", async () => {
        // Wait 10 seconds, for next block mining
        await new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, 6000);
        });

        const result = await demoHost.verify(hostedWallet.address, assetId);
        expect(result).to.be.true;
    }).timeout(15000);

});

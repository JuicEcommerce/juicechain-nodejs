import {expect} from "chai";
import {Node} from "../src/managed/Node";
import {JuicEchain} from "../src/JuicEchain";
import {Asset} from "../src/managed/Asset";
import {AssetParams} from "../src/models/AssetParams";

const fs = require("fs");

var demo: Node;
var juicechain;
var wallet;
var wallet2;
var masterName;

/**
 *  Testing Asset Issue and Wallet
 */
describe('Testing Non Fungible Assets', () => {

    it('Create Node reference', async () => {
        demo = JuicEchain.getNode("demo", "", "");
        expect(demo).not.to.be.null;
    });

    it('Create Wallet', async () => {
        wallet = await demo.createWallet();
        wallet2 = await demo.createWallet();

        expect(wallet).to.not.be.null;
        expect(wallet.node).equals("demo");

        expect(wallet2).to.not.be.null;
    }).timeout(10000);

    it("Issue Master Asset", async () => {
        //create master aset with media
        masterName = "demo:testasset:" + Math.round(Math.random() * 1000) + "#";

        const asset = await demo.issue(masterName, "Mein Master Asset", "admission", 1,
            wallet.address, "BackToTheFuture GmbH");

        expect(asset).to.not.be.null;
        expect(asset.publisher).equals("BackToTheFuture GmbH");
    }).timeout(10000);

    it("Issue NFT", async () => {
        let params: AssetParams = new AssetParams();
        params.inception = new Date("2019-05-05");
        params.expiration = new Date("2019-06-05");

        const signature = wallet.getAuthentication();

        let nft: Asset = await demo.issueNFT(masterName + "1", wallet2.address, "", params, 1, signature);

        expect(nft).to.not.be.null;
        expect(nft.publisher).equals("BackToTheFuture GmbH");
    }).timeout(15000);

    it("Fetch Balance", async () => {
        const balances = await wallet2.getBalance(0);

        expect(balances).to.be.an.instanceof(Array);
        expect(balances.length).to.equal(1);
        expect(balances[0].quantity).to.equal(1);

        const nft:Asset = await wallet2.getAsset(masterName + "1");

        expect(nft.inception.getTime()).to.be.equal((new Date("2019-05-05")).getTime());
    }).timeout(10000);

});

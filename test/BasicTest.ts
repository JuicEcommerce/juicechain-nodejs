import {expect} from "chai";
import {JuicEchain} from "../src/JuicEchain";
import * as path from "path";
import {Wallet} from "../src/managed/Wallet";
import {Asset} from "../src/managed/Asset";
import {Node} from "../src/managed/Node";

const fs = require("fs");

var demo: Node;
var wallet: Wallet;
var asset: Asset;
var assetName: string;

/**
 *  Testing Asset Issue and Wallet
 */
describe('Testing Asset Issue and Wallet', () => {

    it('Create Node reference', async () => {
        demo = JuicEchain.getNode("demo", "", "");

        expect(demo).not.to.be.null;
    });

    it('Create Wallet', async () => {
        wallet = await demo.createWallet();

        expect(wallet).to.not.be.null;
        expect(wallet.node).equals("demo");
    }).timeout(10000);

    it("Issue new asset", async () => {
        assetName = "demo:testasset:" + Math.round(Math.random() * 1000);
        asset = await demo.issue(assetName, "Mein Test Asset", "admission", 100,
            wallet.address, "BackToTheFuture GmbH");

        expect(asset).to.not.be.null;
        expect(asset.publisher).equals("BackToTheFuture GmbH");
    });

    it("Fetch Balance", async () => {
        const balances = await wallet.getBalance(0);

        expect(balances).to.be.an.instanceof(Array);
        expect(balances.length).to.equal(1);
        expect(balances[0].quantity).to.equal(100);
    }).timeout(10000);

    it("Attach card image to asset", async () => {
        const buffer = fs.readFileSync(path.join(__dirname, './contents/card.png'));
        const result = await asset.setCard(buffer);

        expect(result).to.be.true;
    }).timeout(10000);

    it("Attach media to asset", async () => {
        const buffer = fs.readFileSync(path.join(__dirname, './contents/media.png'));
        const result = await asset.setMedia(buffer);

        expect(result).to.be.true;
    });

    it("Transfer asset to mobile wallet", async () => {
        const wallet2 = await demo.createWallet();

        const result = await wallet.transfer(wallet2.address, assetName, 2, "{}");
        expect(result).to.be.true;

        // check balance of receiver
        const balances = await wallet2.getBalance(0);
        expect(balances).to.be.an.instanceof(Array);
        expect(balances.length).to.equal(1);
        expect(balances[0].quantity).to.equal(2);
    });

});

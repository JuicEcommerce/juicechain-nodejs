import { Asset } from "./models/Asset";
import { JuicEchain } from "./JuicEchain";
import { CryptoUtils } from "./helpers/CryptoUtils";
import { Balance } from "./models/Balance";
import { Wallet } from "./models/Wallet";
import { AssetParams } from "./models/AssetParams";

let mobileWalletAddress: string = "1P6WhPKyT4qVyvNS4sV5cjpSfiW2roEZKi"; //when using other address: error -26: one of outputs doesn't have receive permission

async function main() {
    /**
     *  Simple JuicEchain API Usage example
     *
     *  => enter your wallet address to test with
     *  => external (mobile) wallet
     */

    // Initialize JuicEchain with params
    let demo: JuicEchain = new JuicEchain("demo", "none", "none");

    // ------------------------------------------------------------------------------------
    //
    // ------------------------------------------------------------------------------------
    console.log("#Creating Wallet and fungible asset");

    let wallet: Wallet = await demo.wallets().create();
    console.log(" - Created new wallet: " + wallet.address);

    // Create signature (required for next calls)
    let signature: string = CryptoUtils.generateAuthToken(wallet.privateKey, wallet.address);

    // Issue new Asset
    let assetName: string = generateRandomAssetName();
    let asset: Asset = await demo.assets().issue(assetName, "Mein Test Asset", "admission",
    100, wallet.address, "BackToTheFuture GmbH", signature);
    console.log(" - Issued new Asset:" + asset.name);

    // Verify Balance of issuer
    let balance: Balance[] = await demo.wallets().getBalance(wallet.address, 0); //response is not the same as balance model
    console.log("Wallet balance:");
    console.log(balance[0])
    console.log(" - " + balance[0].asset + " = " + balance[0].quantity);

    // Attach card image (for mobile wallet) to the asset
    let result: boolean = await demo.assets().setCard(assetName, "./testimage.png");
    console.log(" - Attached card image to asset: " + result);

    // Attach media (image) (for mobile wallet) to the asset
    let resultMedia: boolean = await demo.assets().setMedia(assetName, "./testimage.png");
    console.log(" - Attached media image to asset: " + resultMedia);

    // Transfer asset to target wallet
    let successTransfer: boolean = await demo.wallets().transfer(mobileWalletAddress, assetName, 1, {}, signature);
    console.log(" - Asset transfered to mobile wallet: " + successTransfer);

    // ------------------------------------------------------------------------------------------------------------
    // Master & NFT's
    // ------------------------------------------------------------------------------------------------------------

    console.log(" ");
    console.log("#Creating Master and NFT's");

    //create master aset with media
    let masterName: string = generateRandomAssetName() + "#";
    let masterAsset: Asset = await demo.assets().issue(masterName, "Mein Master Asset", "admission", 1, 
    wallet.address, "BackToTheFuture GmbH", signature);
    await demo.assets().setMedia(masterName, "./testimage.png");
    await demo.assets().setCard(masterName, "./testimage.png");
    console.log(" - Issued new master asset: " + masterAsset.name);

    // Issue NFT to mobile wallet
    let params: AssetParams = new AssetParams();
    params.inception = new Date("2019-05-05");
    params.expiration = new Date("2019-06-05");
    let nft: Asset = await demo.assets().issueNFT(masterName + "1", mobileWalletAddress, "", params, 1, signature);
    console.log(" - Issued new NFT to mobile wallet: " + nft.name);

    return "done";
}

function generateRandomAssetName(): string {
    let n = Math.floor(Math.random() * 50000);
    return "demo:testasset:" + n;
}

//run usage example
main()
.then(res => {
    console.log(res);
})
.catch(err => {
    console.log(err);
});
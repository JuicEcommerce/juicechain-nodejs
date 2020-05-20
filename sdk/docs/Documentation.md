# **JuicEchain EthereumService (SDK)**

EthereumService SDK contains functions which are used for communication with the Contracts on the chain.

Wallets created on the chain are network specific and can operate only on the network they are created in. Created assets and publishers on other hand are unique, meaning they can not be created with the same identifier.

## Good to know

**PublisherID** in contract is represented as 8 Bytes long uniqe identifier. <br>
This means that publisher IDs has to be sent as: "0x" + hex value of the publisher ID.

<br>

**AssetID** is a 32 Bytes long uniqe identifier for Assets in the JuicEchain Network.<br>
This means that asset IDs has to be sent as: "0x" + hex value of the publisher ID.<br>
AssetID are an construct of 3 parameters, enabling identification and indexation.

- 8 Bytes 
   - The first 8 bytes representing the Assets Publishers uniqe ID.
- 20 Bytes / 24 Bytes 
   -	Root Assets can use the rest of 24 Bytes for any uniqe identifier.
Child Assets can use only 20 Bytes
- 4 Bytes 
   -	Indexed child asset - identifier

eg. <br> 
"publisherID:assetID"                 -> Root Asset <br>
"publisherID:RootAssetID:ChildIndex"  -> Root Asset

<br> 

**ALL** function calls require sender object as a parameter.

```typescript
 const sender: IAccount = {
    privateKey: String = "private-key";
    publicKey: String = "public-key"; // Optional
    publisher: String = "PublisherId":, // Optional
    address = 'account-address';
 };
```
<br> 

## Create an instance of EthereumService

```typescript
 const ethereumService:EthereumService = new EthereumService();
```
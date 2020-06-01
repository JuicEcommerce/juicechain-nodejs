# JuicEchain (SDK)

**JuicEchain** The management of digital assets will be an essential part of new business models and close connected to 
their success. Our JuicEchain solution is the tool to enable and guarantee exactly that. It’s the easiest available 
access to blockchain technology without worrying about technical and infrastructure (node-network) requirements, 
accessible as any other cloud service. <a href="https://juicecommerce.de/juicechain">Learn more here.</a> 

TypeScript SDK for managing a Node in the JuicEchain Blockchain Network. It allows users to create and control Wallets, issue 
digital Assets and Non-fungible Assets (NFA's).<br />

JuicEchain SDK consists of Etherium Smart Contracts ABIs function calls that allow communication with the blockchain.

### Prerequisite

 - **Node endpoint** The Node endpoint you like to connect to
 - **Chain ID** The chain ID you'd like to use


### Good to Know

#### Publishers
Publishers are entities in the JuicEchain which are allowed to Issue and Manage Assets and Wallets.
Each publisher is operating his own Wallet network.
**PublisherID** in contract is represented as 8 Bytes long uniqe identifier.
This means that publisher IDs are starting with "0x" followed by hex value of the ID. We got you covored. Bytes32 class can be used to get hex values IDs.



#### Wallet
Wallet is a unique address in JuicEchain which allows its owner to manage and collect digital Assets. It is based on 
asymmetric encryption with public (wallet address) and private keys (made for securing and signing every transaction).


#### Wallet Transfer lock
Wallets created on our network can be modified to allow control over transfering assets. Publishers can control which assets are transferable to their wallets. There are 4 types of wallet based on transfer options - open, open-whitelist, whitelist and closed. 
<br>
<br>
Available transfer lock options:

* **0**  - open - Assets from every publisher are allowed
* **1**  - open-whitelist - Every whitelisted asset-publisher is allowed (owner can modify)
* **2**  - whitelist - As above, but only publisher can modify it
* **3**  - closed - Only assets from publisher are allowed

Publishers have also ability to blacklist a publisher. Blacklisted publisher assets can not be trasfered to modified wallet.

#### Digital Asset
Digital Asset is a unique digital representation of Tickets, Vouchers, Coupons, Contracts or Identities in JuicEchain 
network. Users can issue digital assets in amount they need with all necessary parameters and transfer them
unlimited number of times. Every digital Asset has these properties: <br />
* **active** - boolean value that identifies if asset can be operated with/on
* **root** - boolean value that identifies if asset is a root asset
* **quantity** - quantity of assets issued
* **nftLimit** - limit of the Non Fungible Assets that can be issued
* **nftQuantity** - quantity of the Non Fungible Assets that are issued
* **validation** - validation property
* **created** - timestamp when the asset is created
* **chargeable** - boolean value that identifies if asset should be charged
* **transferLock** - transfer lock property which controls within which network/wallets/publishers can asset be transfered
* **checksum** - checksum array
* **network** - network contract address the asset was created in


####  Digital Asset Classifications

There are 3 different classifications of digital Assets
1. Multi Asset (Fungible Asset)
    * Multi Assets are the default classification and are specified by the initial amount issued. Each multi asset has the same
    properties and can't be distinguish between each other. 

2. Master Asset
    * Master Assets are the template for Non-fungible (NFT) assets or child assets. All properties specified
    on the master asset are mirrored to each child, if not overwritten by the child.
    * Only the owner of the Master asset is allowed to issue NFT's of this class.
    * The quantity of master assets is limited to one only, but declares the amount of child assets allowed to be issued.

2. Asset (NFA - Non Fungible Asset)
    * None fungible asset are a copy of its master, but can overwrite or contain additional / different properties.
    * E.g. Ticket which has a unique seat allocation in a Theatre, Stadium, Bus or even Hotel room door key.

#### Asset Name

Asset names are unique in the whole network and limited to 32 character including the nodes prefix.
Default separation character is `:` and only required once after the publishers name:

*Example asset name, issued on the node "Demo"*
 ```
 publisherID:exampleassetname
 ```

A special case are Master and Child assets. *Master assets need to end with  `:0` index.*
 ```
 // Master Asset Name
 publisherID:examplemaster:0

 // Child assets can occupy all left character space after the second separator
 publisherID:examplemaster:1
 ```

 > Regex for Asset name
 > `/^[a-z0-9#]+([\:]{1}[a-z0-9#]+)*$/g;`


The library provides **AssetID** class which can be used to generate hex values of asset IDs.
```typescript
const hexID = new AssetID('publisherID:exampleassetname').getHex();
```

#### Asset transfer lock

You have ability to controll within which wallets can asset be transfered between.
<br><br>
Available transfer lock options:

* **00** : None (From any wallet to any wallets)
* **01** : Wallet (From publisher wallets to publishers wallets)
* **02** : Publisher (Only publisher can transfer into wallets, owner can return to publisher)

# Coding Examples
 ## Create a new JuicEchain instance

Create a new Node reference by calling "getNode()" from JuicEchain.
 ```typescript
const juicechain: JuicEchain = new JuicEchain(*Chain ID*, *Chain Endpoint*);
 ```

## Create your first Wallet

Wallets are connected to their origin Node. You can call "open()" method on the JuiceChain wallet reference
to create a new wallet on the chain. The wallet is connected to your publisher ID. You can perform transfers
on your own wallets without need for a signature.  

```typescript
const wallet = await juicechain.wallet.open(*PublisherId*, *WalletAddress*, *TransferLock*, *IAccount*);
```
If you dont want to wait for confirmation from the blockchain that the wallet is created and stored you can pass additional boolean parameter that identifies so.

```typescript
const wallet = await juicechain.wallet.open(*PublisherId*, *WalletAddress*, *TransferLock*, *IAccount*, false);
```
You can add the confirm parametar to any function which is not retrieving data from the blockchain. Default value of confirm parametar is `true` - this means SDK will wait for the chain to confirm the action. You can also pass `false` value to the function call, as seen in example above, to continue the workflow without waiting for the confirmation from the chain.

## Issue your first Asset

Assets are connected to their "issuing" wallet. Means the newly created assets are placed
into (address / wallet). They can be from there transferred anywhere further.

```typescript
 const assetId: AssetID = new AssetID;("publisherID:myasset:0").getHex();
 const amount:number = 100;
 const isRoot:boolean = true;
 const account: IAccount = *PublishersAccount*;
 const confirm: boolean = true;


 const response = await juicechain.assets..issue(assetId, isRoot, amount, account, confirm);
```

## Transfer asset

Call `wallet.transfer()" to transfer the given asset with amount to the receivers address.

```typescript
const successTransfer = await juicechain.transfer(*recipientAddress*, *assetId*, 1, *senderAccount*, true);
```

## Fetch wallet balance

The balance (overview of assets owned and amount) can be fetched directly from the Wallet reference.

```typescript
 const address: Address = *some-account-address*;
 const offset:number = 0;
 const account: IAccount = *SomeAccount*;

const balance:Array<Balance> = await juicechain.wallet.getBalance(address, offset, account);
```

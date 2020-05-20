# Assets

Digital Asset is a unique digital representation of Tickets, Vouchers, Coupons, Contracts or Identities in JuicEchain network. Publishers can issue digital assets in amount they need with all necessary parameters and transfer them unlimited number of times. Every digital Asset has these properties:

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

## Issue Assets

```typescript
/**
 * Create new digital asset and store it to the publisher wallet.
 * Only executeable by a publisher.
 * @param assetId
 * @param root
 * @param amount
 * @param publisher
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async issue(assetId: AssetIdHex, root: boolean, amount: number, 
    publisher: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const issue = await ethereumService.issue("publisherID:myasset", false, 100, publisher);
```



## Issue Non-Fungible Asset

```typescript
/**
 * Create new Non-Fungible Asset and store it to the recipients account.
 * Only executeable by a publisher.
 * @param assetId
 * @param recipient
 * @param publisher
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async issueNFA(assetid: AssetIdHex, recipient: Address, publisher: IAccount, confirm?: boolean): Promise<any> 
```

```typescript 
const issue = await ethereumService.issueNFA("publisherID:myasset:1", "some-account-address", publisher);
```



## Set active

```typescript
/**
 * Activate and deactivate assets.
 * Only executeable by asset owner.
 * @param assetId
 * @param active
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async setAssetActive(assetId: AssetIdHex, active: boolean, sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const setActive = await ethereumService.setAssetActive("publisherID:myasset", false, sender);
```



## Asset exists

```typescript
/**
 * Check if asset exists.
 * @param assetId
 * @param sender
 */
public async assetExists(assetId: AssetIdHex, sender: IAccount): Promise<boolean>
```

```typescript 
const assetExists = await ethereumService.assetExists("publisherID:myasset", sender);
```



## Check if root asset

```typescript
/**
 * Check if asset is root asset.
 * @param assetId
 * @param sender
 */
public async isRootAsset(assetId: AssetIdHex, sender: IAccount): Promise<boolean>
```

```typescript 
const isRootAsset = await ethereumService.isRootAsset("publisherID:myasset", sender);
```



## Check if asset is active

```typescript
/**
 * Check if asset is active.
 * @param assetId
 * @param sender
 */
public async isAssetActive(assetId: AssetIdHex, sender: IAccount): Promise<boolean>
```

```typescript 
const isAssetActive = await ethereumService.isAssetActive("publisherID:myasset", sender);
```
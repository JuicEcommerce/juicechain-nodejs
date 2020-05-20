# Orange



## Open account

```typescript
/**
 * Open new wallet on the network issued by publisher.
 * @param publisherId
 * @param address
 * @param transferLock
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async open(publisherId: PublisherId, address: string, transferLock: number, sender: IAccount, confirm?: boolean):        Promise<Result<any>>
```

```typescript 
const open = await ethereumService.open("publisherID-hex-string", "some-wallet-address", 2, sender);
```



## Transfer

```typescript
/**
 * Transfer asset to given wallet address.
 * @param recipient
 * @param assetId
 * @param amount
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async transfer(recipient: Address, assetId: AssetIdHex, amount: number,
    sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const transfer = await ethereumService.transfer("some-wallet-address", "assetID-hex-string", 100, sender);
```



## Get asset balance

```typescript
/**
 * Get balance of an asset in wallet.
 * @param address
 * @param assetId
 * @param sender
 */
public async getAssetBalance(address: Address, assetId: AssetIdHex, sender: IAccount,):Promise<number>
```

```typescript 
const balance = await ethereumService.getAssetBalance("some-wallet-address", "assetID-hex-string", sender);
```



## Get balance

```typescript
/**
 * Get balance of 10 assets in wallet.
 * @param address
 * @param offset
 * @param sender
 */
public async getBalance(address: string, offset: number, 
    sender: IAccount): Promise<{ count: number, assets: Array<{ id: string, quantity: number }>}> 
```

```typescript 
const balance = await ethereumService.getBalance("some-wallet-address", 0, sender);
```



## Get wallet

```typescript
/**
 * Get wallet information.
 * @param address
 * @param sender
 */
public async getWallet(address: string, sender: IAccount): Promise<any>
```

```typescript 
const wallet = await ethereumService.getWallet("some-wallet-address", sender);
```



## Get asset

```typescript
/**
 * Get asset information.
 * @param address
 * @param sender
 */
public async getAsset(asssetId: AssetIdHex, sender: IAccount): Promise<any> 
```

```typescript 
const wallet = await ethereumService.getAsset("assetID-hex-string", sender);
```



## Has asset

```typescript
/**
 * Check if wallet has an asset.
 * @param address
 * @param assetId
 * @param sender
 */
public async hasAsset(address: string, assetId: string, sender: IAccount): Promise<boolean> 
```

```typescript 
const hasAsset = await ethereumService.hasAsset("some-wallet-address", "assetID-hex-string", 0, sender);
```



## Set asset TransferLock

```typescript
/**
 * Change transfer lock on an asset
 * @param assetId
 * @param transferLock
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async setAssetTransferLock(assetId: AssetId, transferLock: number, 
    sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const setTransferLock = await ethereumService.setAssetTransferLock("assetID-hex-string", 1, sender);
```



## Set asset validation

```typescript
/**
 * Set validation property on asset
 * @param assetId
 * @param validation
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async setValidation(assetId: AssetId, validation: number, sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const setTransferLock = await ethereumService.setAssetTransferLock("assetID-hex-string", 123, sender);
```



## Set asset checksum

```typescript
/**
 * Set checksum
 * @param assetId
 * @param validation
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async setChecksum(assetId: AssetId, checksum: any, sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const setTransferLock = await ethereumService.setChecksum("assetID-hex-string", checksum, sender);
```



## Whitelist

```typescript
/**
 * Whitelist publisher for given acount
 * @param address
 * @param targetedPublisherId
 * @param listed
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async whitelist(address: string, targetedPublisherId: PublisherId, 
    listed: boolean, sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const whitelist = await ethereumService.whitelist("some-wallet-address", "publisher-hex-id", true, sender);
```



## Blacklist

```typescript
/**
 * Blacklist publisher for given acount
 * @param address
 * @param targetedPublisherId
 * @param listed
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async blacklist(address: string, targetedPublisherId: PublisherId, 
    listed: boolean, sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const blacklist = await ethereumService.blacklist("some-wallet-address", "publisher-hex-id", true, sender);
```



## Set wallet TransferLock

```typescript
/**
 * Set transferlock property for wallet
 * @param address
 * @param transferLock
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async setWalletTransferLock(address: string, transferLock: number, 
    sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const transferLock = await ethereumService.setWalletTransferLock("some-wallet-address", 3, sender);
```



## Set wallet active

```typescript
/**
 * Activate or deactivate account
 * @param address
 * @param active
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async setAccountActive(address: string, active: boolean, sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript 
const transferLock = await ethereumService.setAccountActive("some-wallet-address", true, sender);
```
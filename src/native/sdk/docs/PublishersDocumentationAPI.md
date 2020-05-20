# Publisher

**PublisherID** in contract is represented as 8 Bytes long uniqe identifier. <br>
This means that publisher IDs has to be sent as: "0x" + hex value of the publisher ID.

## Create new publisher

```typescript
/**
 * Create a new publisher and make account for new created publisher.
 * @param publisherId
 * @param address
 * @param sender
 */
public async createPublisher(publisherId: PublisherId, address: string, sender: IAccount): Promise<Result<any>>
```

```typescript
const newPublisher = await ethereumService.createPublisher("hex-string-id", "some-account-address", sender);
```



## Get publisher info

```typescript
/**
 * Get publishers info.
 * @param publisherId
 * @param sender
 */
public async getPublisher(publisherId: PublisherId, sender: IAccount): Promise<any> 
```

```typescript
const publisher = await ethereumService.getPublisher("hex-string-id", sender);
```



## Is owner

```typescript
/**
 * Check if given address is a owner of an publisher.
 * @param publisherId
 * @param address
 * @param sender
 */
public async isOwner(publisherId: PublisherId, address: string, sender?: IAccount): Promise<boolean>
```

```typescript
const isOwner = await ethereumService.isOwner("hex-string-id", "some-account-address", sender);
```



## Set active

```typescript
/**
 * Set active property of a publisher.
 * Only executeable by a publisher or owner.
 * @param publisherId
 * @param active
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async setPublisherActive(publisherId: PublisherId, active: boolean, 
    sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript
const setActive = await ethereumService.setPublisherActive("hex-string-id", true, sender);
```



## Set checksum

```typescript
/**
 * Set checksum.
 * Only executeable by a publisher or owner.
 * @param publisherId
 * @param checksum
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async setPublisherChecksum(publisherId: PublisherId, checksum: any, 
    sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript
const setChecksum = await ethereumService.setPublisherChecksum("hex-string-id", checksum, sender);
```



## Set publisher hosts

```typescript
/**
 * Set hosts for the publisher.
 * Only executeable by a publisher or owner.
 * @param publisherId
 * @param host1
 * @param host2
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async setPublisherHosts(publisherId: PublisherId, host1: any, host2: any, 
    sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript
const setHosts = await ethereumService.setPublisherHosts("hex-string-id", 123, 321, sender);
```



## Transfer ownership

```typescript
/**
 * Transfer publisher to another owner.
 * Only executeable by a owner.
 * @param publisherId
 * @param newOwnerAddress
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async transferPublisher(publisherId: PublisherId, newOwnerAddress: Address, 
    sender: IAccount, confirm?: boolean): Promise<any>
```

```typescript
const newOwner = await ethereumService.transferPublisher("hex-string-id", "some-account-address", sender);
```



## Get publishers owner

```typescript
/**
 * Get publishers owner address.
 * @param publisherId
 * @param sender
 */
public async getPublisherOwner(publisherId: PublisherId, sender: IAccount): Promise<Result<any>> 
```

```typescript
const owner = await ethereumService.getPublisherOwner("hex-string-id", sender);
```



## Check if available

```typescript
/**
 * Check if publisher is available.
 * @param publisherId
 * @param sender
 */
public async isPublisherAvailable(publisherId: PublisherId, sender: IAccount): Promise<Result<any>>
```

```typescript
const owner = await ethereumService.isPublisherAvailable("hex-string-id", sender);
```
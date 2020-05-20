# Consortium



## Get members size

Maximum members size in Constortium is 10

```typescript
/**
 * Get count of consortium members.
 * @param sender
 */
public async getSize(sender: IAccount): Promise<string>
```

```typescript
const memberSize = await ethereumService.getSize(sender);
```



## Vote

```typescript
/**
 * Voting for adding or removing member of Consortium.
 * @param memberAddress
 * @param vote
 * @param sender
 */
public async vote(memberAddress: string, vote: boolean, sender: IAccount): Promise<any>
```

```typescript 
const vote = await ethereumService.vote('*some-account-address*', sender);
```



## Get members

Returns active members of Consortium;

```typescript
/**
 * Get array of members addresses.
 * @param sender
 */
public async getMembers(sender: IAccount): Promise<string>
```

```typescript 
const members: Array<*Address*> = await ethereumService.getMembers(sender);
```



## Get member votes

Returns number of positive votes that a member has collected;

```typescript
/**
 * Get positive votes of member address.
 * @param address
 * @param sender
 */    
public async getMemberVote(address: string, sender: IAccount): Promise<string>
```

```typescript 
const memberVotes = await ethereumService.getMemberVotes('*some-account-address*', sender);
```



## Check if address is an active member

```typescript
/**
 * Check if address is a member of Consortium.
 * @param address
 * @param sender
 */
public async isMember(address: string, sender: IAccount): Promise<string>
```

```typescript 
const isMember: Boolean = await ethereumService.isMember('*some-account-address*', sender);
```



## Vote for open fee

```typescript
/**
 * Vote for open fee amount.
 * Only executeable by a member of the Consortium.
 * @param amount
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async voteOpenFee(amount: number, sender: IAccount, confirm?: boolean): Promise<any>
```

** Only possible to be executed by a member of Consortium **

```typescript 
const voteOpenFee = await ethereumService.voteOpenFee('*some-account-address*', sender);
```



## Vote for issue fee

```typescript
/**
 * Vote for issue fee amount.
 * Only executeable by a member of the Consortium.
 * @param amount
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async voteIssueFee(amount: number, sender: IAccount, confirm?: boolean): Promise<any>
```

** Only possible to be executed by a member of Consortium **

```typescript 
const voteIssueFee = await ethereumService.voteIssueFee('*some-account-address*', sender);
```



## Vote for transfer fee

```typescript
/**
 * Vote for transfer fee amount.
 * Only executeable by a member of the Consortium.
 * @param amount
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async voteTransferFee(amount: number, sender: IAccount, confirm?: boolean): Promise<any>
```

** Only possible to be executed by a member of Consortium **

```typescript 
const voteTransferFee = await ethereumService.voteTransferFee('*some-account-address*', sender);
```



## Vote for update fee

```typescript
/**
 * Vote for update fee amount.
 * Only executeable by a member of the Consortium.
 * @param amount
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async voteUpdateFee(amount: number, sender: IAccount, confirm?: boolean): Promise<any>
```

** Only possible to be executed by a member of Consortium **

```typescript 
const voteUpdateFee = await ethereumService.voteUpdateFee('*some-account-address*', sender);
```



## Vote for publishers fee

```typescript
/**
 * Vote for publisher fee amount.
 * Only executeable by a member of the Consortium.
 * @param amount
 * @param sender
 * @param {boolean} [confirm=true] - (optional) Wait for confirmation.
 */
public async votePublishersFee(amount: number, sender: IAccount, confirm?: boolean): Promise<any>
```

** Only possible to be executed by a member of Consortium **

```typescript 
const votePublishersFee = await ethereumService.votePublishersFee('*some-account-address*', sender);
```
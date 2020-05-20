import { Address } from "../core/types/Address";

export class ChainAssetData {
    active: boolean;
    root: boolean;
    quantity: number;
    nftLimit: number;
    nftQuantity: number;
    validation: number;
    created: string;
    chargeable: boolean;
    transferLock: string;
    checksum: Array<string>;
    network: Address;
}
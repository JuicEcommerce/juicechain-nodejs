import {Address} from "./types/Address";
import {PublisherId} from "./types/PublisherId";

export interface IAccount {
    privateKey: string;
    publicKey?: string;
    publisher?: PublisherId,
    address: Address;
}

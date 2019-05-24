import { JuicEchain } from "../JuicEchain";
import { Balance } from "../models/Balance";
import { Wallet } from "../models/Wallet";

export class WalletService {

    private juicechain: JuicEchain;

    constructor(juicechain: JuicEchain) {
        this.juicechain = juicechain;
    }

    public async create(): Promise<Wallet> {
        try {
            let response = await this.juicechain.requestPost("wallet/", "", "");
            if (response && response.success) {
                let wallet: Wallet = new Wallet();
                wallet = response.payload;
                return wallet;
            }
            return null; 
        } catch(exception) {
            return exception;
        }
    }

    public async getBalance(address, minconf: number): Promise<Balance[]> {
        let balances: Balance[] = null;

        try {
            let response = await this.juicechain.requestGet("/node/wallet/" + address + "/" + minconf + "/" + "/ACV");
            if (response && response.success) {
                balances = [];
                for (let _balance of response.payload) {
                    _balance.updated = new Date();
                    balances.push(_balance);
                }
                return balances;
            }
            return null; 
        } catch(exception) { //not authorized
            return exception;
        }
    }

    public async transfer(receiverAddress: string, asset: string, quantity: number, payload: string, signature: string): Promise<boolean> {
        let body = {
            asset: asset,
            amount: quantity,
            payload: payload
        }

        try {
            let response = await this.juicechain.requestPost("wallet/transfer/" + receiverAddress, JSON.stringify(body), signature);
            if (response && response.success) {
                return true;
            }
            return null; //failed transfer 
        } catch(exception) {
            return exception;
        }
    }
}
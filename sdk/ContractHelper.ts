import {IAccount} from "../src/core/IAccount";


export class ContractHelper {

    private abi: any;
    private web3: any;
    private address: any;
    private instance: any;
    private sender: IAccount;
    private chainId;

    constructor(abi, address, web3, sender: IAccount, chainId) {
        this.address = address;
        this.abi = abi;
        this.web3 = web3;
        this.sender = sender;
        this.chainId = chainId;
        this.instance = new web3.eth.Contract(this.abi, this.address, {
            from: sender.address
        });
    }

    getLatestNonce(address: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.web3.eth.getTransactionCount(address, 'pending')
                .then(nonce => {
                    resolve(nonce);
                });
        });
    }

    async test(params, from){
        this.instance.methods.issue(...params).send({gas: 90000, from: from })
            .on('transactionHash', hash => {
                console.log('TX Hash', hash)
            })
            .then(receipt => {
                console.log('Mined', receipt)
                if(receipt.status == '0x1' || receipt.status == 1){
                    console.log('Transaction Success')
                }
                else
                    console.log('Transaction Failed')
            })
            .catch( err => {
                console.log('Error', err)
            })
            .finally(() => {
                console.log('Extra Code After Everything')
            })
    }

    async send(method, params, confirm?: boolean): Promise<{success: boolean, error?: string}> {
        const web3 = this.web3;

        // create instance of method
        const methodInstance = await this.instance.methods[method](...params);

        // pre-call method to fetch expected price
        // and check in case of rejection
        const preCheck = await this.preCall(methodInstance);
        if (!preCheck.success) return { success: false, error: preCheck.error };

        // when not waiting for confirm => request nonce
        const nonce = await this.getLatestNonce(this.sender.address);

        const tx = {
            from: this.sender.address,
            to: this.address,
            gas: preCheck.requiredGas,
            nonce: nonce,
            gasPrice: web3.utils.toHex(0),
            gasLimit: web3.utils.toHex(30000),
            data: methodInstance.encodeABI(),
            chainId: web3.utils.toHex(this.chainId),
        };

        //Logging.debug("Transaction", "Nonce: " + nonce, tx);

        return await new Promise((resolve, reject) => {
            web3.eth.accounts.signTransaction(tx, this.sender.privateKey).then(signed => {
                    web3.eth
                        .sendSignedTransaction(signed.rawTransaction)
                        .on('confirmation', (confirmation, receipt) => {
                            //console.log('=> confirmation: ' + confirmationNumber);
                        })
                        .on('transactionHash', hash => {
                            //console.log('=> hash');
                            //console.log(hash);
                            if (!confirm)
                                resolve({ success: true });
                        })
                        .on('receipt', receipt => {
                            //console.log('=> reciept');
                            //console.log(receipt);
                            resolve({
                                success: true
                            });
                        })
                        .on('error', error => {
                            console.log(error.message);
                            //reject(error.message);
                        });
            });
        });
    }

    /**
     * Call the method before create the signed transaction to
     * calculate expected gas and check for rejection
     *
     * @param methodInstance
     */
    async preCall(methodInstance: any): Promise<{ success: boolean, requiredGas?: number, error?: string}> {
        try {
            const requiredGas = await methodInstance.estimateGas();
            return {
                success: true,
                requiredGas: requiredGas
            };
        } catch(exception){
            try {
                const ret = await methodInstance.call();
                return ret;
            } catch (exception) {
                return {
                    success: false,
                    error: exception.reason
                }
            }
        }
    }

    async call(method, params) {
        return await this.instance.methods[method](...params).call();
    }

};
exports.ContractHelper = ContractHelper;

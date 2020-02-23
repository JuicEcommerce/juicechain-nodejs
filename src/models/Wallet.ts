import EthCrypto from "eth-crypto";

export class Wallet {

    public address: string;
    public publicKey: string;
    protected privateKey: string;

    /* Name of the wallet */
    public title: string;

    /* Id of publisher */
    public publisher: string;

    /* Wallet theming details */
    public theme: string;

    /* Base64 Encoded Logo Image of Publisher */
    public logo: string;

    constructor(address: string, privateKey: string, publickey?: string) {
        this.address = address;
        this.publicKey = publickey;
        this.privateKey = privateKey;
    }

    /**
     * Generate Signed Token
     *
     * @param payloae: Any JSON object to be added to the signature
     */
    public createSignedToken(_payload?: any) {

        const body = {
            address: this.address,
            timestamp: (new Date()).toUTCString(),
            payload: _payload
        };

        // generate hash of message
        const messageHash = EthCrypto.hash.keccak256(JSON.stringify(body));

        // generate signature
        const signature = EthCrypto.sign(
            this.privateKey,    // privateKey
            messageHash         // hash of message
        );

        // generate message
        (<any>body).signature = signature;

        return Buffer.from(JSON.stringify(body)).toString('base64');
    };

}
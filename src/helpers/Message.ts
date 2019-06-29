const bitcore = require('bitcore-lib');
const BufferWriter = bitcore.encoding.BufferWriter;
const ECDSA = bitcore.crypto.ECDSA;
const sha256sha256 = bitcore.crypto.Hash.sha256sha256;

export class Message {

    error: any;
    message: string;
    MAGIC_BYTES: any;

    constructor(message: string) {
        this.MAGIC_BYTES = Buffer.from('Bitcoin Signed Message:\n');
        this.message = message;
    }

    /**
     * Will sign a message with a given bitcoin private key.
     *
     * @param {PrivateKey} privateKey - An instance of PrivateKey
     * @returns {String} A base64 encoded compact signature
     */
    public sign(privateKey) {
        const ecdsa = new ECDSA();
        ecdsa.hashbuf = this.magicHash();
        ecdsa.privkey = privateKey;
        ecdsa.pubkey = privateKey.toPublicKey();
        ecdsa.signRandomK();
        ecdsa.calci();
        return ecdsa.sig.toCompact().toString('base64');
    };

    private magicHash() {
        const prefix1 = BufferWriter.varintBufNum(this.MAGIC_BYTES.length);
        const messageBuffer = Buffer.from(this.message);
        const prefix2 = BufferWriter.varintBufNum(messageBuffer.length);
        const buf = Buffer.concat([prefix1, this.MAGIC_BYTES, prefix2, messageBuffer]);
        return sha256sha256(buf);
    };

}

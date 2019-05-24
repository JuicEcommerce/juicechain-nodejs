const bitcore = require('bitcore-lib');
const PrivateKey = bitcore.PrivateKey;
const PublicKey = bitcore.PublicKey;
const Address = bitcore.Address;
const BufferWriter = bitcore.encoding.BufferWriter;
const ECDSA = bitcore.crypto.ECDSA;
const Signature = bitcore.crypto.Signature;
const sha256sha256 = bitcore.crypto.Hash.sha256sha256;
const JSUtil = bitcore.util.js;

export class Message {

    message: string;
    MAGIC_BYTES: any;

    constructor(message: string) {
        if (!(this instanceof Message)) {
            return new Message(message);
        }

        this.MAGIC_BYTES = new Buffer('Bitcoin Signed Message:\n');
        this.message = message;

        return this;
    }

    public magicHash = function magicHash() {
        const prefix1 = BufferWriter.varintBufNum(this.MAGIC_BYTES.length);
        const messageBuffer = new Buffer(this.message);
        const prefix2 = BufferWriter.varintBufNum(messageBuffer.length);
        const buf = Buffer.concat([prefix1, this.MAGIC_BYTES, prefix2, messageBuffer]);
        const hash = sha256sha256(buf);
        return hash;
    };

    private _sign = function _sign(privateKey) {
        const hash = this.magicHash();
        const ecdsa = new ECDSA();
        ecdsa.hashbuf = hash;
        ecdsa.privkey = privateKey;
        ecdsa.pubkey = privateKey.toPublicKey();
        ecdsa.signRandomK();
        ecdsa.calci();
        return ecdsa.sig;
    };

    /**
     * Will sign a message with a given bitcoin private key.
     *
     * @param {PrivateKey} privateKey - An instance of PrivateKey
     * @returns {String} A base64 encoded compact signature
     */
    public sign = function sign(privateKey) {
        const signature = this._sign(privateKey);
        return signature.toCompact().toString('base64');
    };

    private _verify = function _verify(publicKey, signature) {
        var hash = this.magicHash();
        var verified = ECDSA.verify(hash, signature, publicKey);
        if (!verified) {
            this.error = 'The signature was invalid';
        }
        return verified;
    };

    /**
     * Will return a boolean of the signature is valid for a given bitcoin address.
     * If it isn't the specific reason is accessible via the "error" member.
     *
     * @param {Address|String} bitcoinAddress - A bitcoin address
     * @param {String} signatureString - A base64 encoded compact signature
     * @returns {Boolean}
     */
    public verify = function verify(bitcoinAddress, signatureString) {
        bitcoinAddress = Address.fromString(bitcoinAddress);
        var signature = Signature.fromCompact(new Buffer(signatureString, 'base64'));

        // recover the public key
        var ecdsa = new ECDSA();
        ecdsa.hashbuf = this.magicHash();
        ecdsa.sig = signature;
        var publicKey = ecdsa.toPublicKey();

        var signatureAddress = Address.fromPublicKey(publicKey, bitcoinAddress.network);

        // check that the recovered address and specified address match
        if (bitcoinAddress.toString() !== signatureAddress.toString()) {
            this.error = 'The signature did not match the message digest';
            return false;
        }

        return this._verify(publicKey, signature);
    };

    /**
     * Instantiate a message from a message string
     *
     * @param {String} str - A string of the message
     * @returns {Message} A new instance of a Message
     */
    public fromString = function (str) {
        return new Message(str);
    };

    /**
     * Instantiate a message from JSON
     *
     * @param {String} json - An JSON string or Object with keys: message
     * @returns {Message} A new instance of a Message
     */
    public fromJSON = function fromJSON(json) {
        if (JSUtil.isValidJSON(json)) {
            json = JSON.parse(json);
        }
        return new Message(json.message);
    };

    /**
     * @returns {Object} A plain object with the message information
     */
    public toObject = function toObject() {
        return {
            message: this.message
        };
    };

    /**
     * @returns {String} A JSON representation of the message information
     */
    public toJSON = function toJSON() {
        return JSON.stringify(this.toObject());
    };

    /**
     * Will return a the string representation of the message
     *
     * @returns {String} Message
     */
    public toString = function() {
        return this.message;
    };


}
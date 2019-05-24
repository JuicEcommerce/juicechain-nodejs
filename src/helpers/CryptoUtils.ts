import {Message} from "./Message";
import * as crypto from 'crypto';

const bitcore = require('bitcore-lib');

export class CryptoUtils{

    /**
     * Generate short-live token based on private
     *
     * @param privateKey
     * @param device
     * @param asset
     * @param address
     * @returns {string}
     */
    public static generateAuthToken(privateKey, address, device?: string, asset?: string, validation?: Date): string {

        const _privateKey = bitcore.PrivateKey.fromWIF(privateKey);
        const payload:any = {
            address: address,
            device: device,
            asset: asset,
            timestamp: (validation) ? validation.toUTCString() : (new Date()).toUTCString(),
        };

        // generate signature
        const message = new Message(JSON.stringify(payload));
        const signature = message.sign(_privateKey);

        // generate message
        payload.signature = signature;

        return new Buffer(JSON.stringify(payload)).toString("base64");
    };

    /**
     * Generate message
     */
    public static generateMessage(privateKey, address, node: string, device?: string,  asset?: string, validation?: Date): string {

        const _privateKey = bitcore.PrivateKey.fromWIF(privateKey);
        const payload:any = {
            address: address,
            device: device,
            node: node,
            asset: asset,
            timestamp: (validation) ? validation.toUTCString() : (new Date()).toUTCString(),
        };

        // generate signature
        const message = new Message(JSON.stringify(payload));
        const signature = message.sign(_privateKey);

        // generate message
        payload.signature = signature;

        return JSON.stringify(payload);
    };


    /**
     * Encrypt text
     *
     * @param {string} text
     * @param {string} password
     * @returns {string}
     */
    public static encrypt(text: string, password: string){
        // generate initialization vector
        const iv = new Buffer((<any>crypto.randomBytes(16))); // fill with zeros

        // create cipher
        const cipher = crypto.createCipheriv('aes-128-cbc',
            new Buffer(password, 'hex'), iv);

        return cipher.update(text, 'utf8', 'hex')
            + cipher.final('hex') + ":" + iv.toString('hex');
    }

    /**
     * Decrypt data
     *
     * @param {string} data
     * @param {string} ivs
     * @param {string} password
     * @returns {string}
     */
    public static decrypt(data: string, password: string): string{
        // prepare data
        const payload = data.split(":");
        const iv = Buffer.from(payload[1], 'hex');

        // create cipher
        const decipher = crypto
            .createDecipheriv('aes-128-cbc', new Buffer(password, 'hex'), iv);

        // decipher
        return decipher.update(payload[0], 'hex', 'utf8')
            + decipher.final('utf8');
    }

}
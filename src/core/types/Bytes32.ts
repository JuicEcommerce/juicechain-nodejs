import {PublisherId} from "./PublisherId";

const Web3 = require("web3");

export class Bytes32{

    private id: string;

    constructor(id: string) {
        if(id.startsWith("0x")) {
            this.id = id;
        } else {
            this.id = Web3.utils.fromAscii(id);
        }
    }

    public equals(object: Bytes32){
        return (object.toString() == this.toString());
    }

    public toAscii(){
        return Web3.utils.toAscii(this.id);
    }

    public toString(){
        return this.id;
    }

    public parse(ascii: string): Bytes32 {
        return new Bytes32(Web3.utils.fromAscii(ascii));
    }

    public static fromAscii(ascii: string): string {
        return Web3.utils.fromAscii(ascii);
    }

    public static toAscii(hex: string): string {
        return Web3.utils.toAscii(hex);
    }

    public static createAssetId(publisherHex: PublisherId, assetIdAscii: string){
        return Bytes32.fromAscii(Bytes32.toAscii(publisherHex) + assetIdAscii);
    }

    private hexToBytes(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }

    private bytesToHex(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join("");
    }

    public extractPublisherId(): PublisherId {
        const bytes = this.hexToBytes(this.id);
        return "0x" + this.bytesToHex(bytes.slice(1, 9));
    }

    public valueOf() {
        return this.id;
    }

}

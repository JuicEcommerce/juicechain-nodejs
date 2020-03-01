import {Bytes32} from "./Bytes32";
import {PublisherId} from "./PublisherId";
import {AssetIdHex} from "./AssetIdHex";

export class AssetId extends Bytes32 {

    constructor(value: string | []) {
        super(null);
        if (typeof value === 'string' && !value.startsWith("0x"))
            this.parse(value);
        else
            super.parse(value);
    }

    /**
     * Parse AssetID in literal string format
     *
     * Format: publisherId:assetName:index
     *
     * 48 - 57
     * 65 - 90
     * 97 - 122
     *
     * @param assetLiteral
     */
    public parse(assetLiteral: string) {
        const parts = assetLiteral.split(":");
        if (parts.length > 3)
            throw new Error("Invalid literal");

        const publisherIdBytes = this.stringToBytes(parts[0], 8);
        const assetName = this.stringToBytes(parts[1], parts.length == 3 ? 20 : 24);
        let id = [...publisherIdBytes, ...assetName];


        if (parts.length == 3){
            const indexNumber = parts[2];

            if (!indexNumber.match(/^-{0,1}\d+$/))
                throw new Error("Index not a number");

            const indexBytes = this.numberToBytes(parseInt(indexNumber));
            id = [...id, ...indexBytes];
        }

        this.value = id;
    }

    public setIndex(index: number) {
        if (index > 2147483647)
            throw new Error("Index to large");

        const hexIndex = this.hexToBytes(index.toString(16), 4);

        for(let i=28;i<32;i++)
            this.value[i] = hexIndex[i-28];
    }

    public getIndex(): number {
        const hex = this.bytesToHex(this.value.slice(28, 32));
        return parseInt(hex, 16);
    }

    /**
     * To literal
     *
     * 48 - 57
     * 65 - 90
     * 97 - 122
     *
     * @param child
     */
    public toLiteral(child?: boolean): string {

        const publisher = this.bytesToString(<any> this.value.slice(0, 8), true);
        const name = this.bytesToString(<any> this.value.slice(8, child ? 28: 32), true);

        if(child){
            const index = this.bytesToNumber(<any> this.value.slice(28, 32));
            return publisher + ":" + name + ":" + index;
        } else {
            return publisher + ":" + name;
        }

    }

    public getRootId(): AssetIdHex {
        return "0x" + this.bytesToHex(this.value.slice(0, 28)) + "00000000";
    }

    public getPublisherId(): PublisherId {
        return "0x" + this.bytesToHex(this.value.slice(0, 8));
    }

}

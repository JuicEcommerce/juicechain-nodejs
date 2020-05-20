const Web3 = require("web3");

export class Bytes32 {

    protected value: any[] = [];

    constructor(value: string | []) {
        if (value) this.parse(value);
    }

    public parse(value: string | []){
        if (value instanceof Array){
            this.value = value;
        } else if(value.startsWith("0x")) {
            this.value = this.hexToBytes(value);
        } else {
            throw new Error("Invalid value");
        }
    }

    public static fromAscii(ascii: string): string {
        if(!ascii)
            return "0x00";
        let hex = "";
        for(let i = 0; i < ascii.length; i++) {
            let code = ascii.charCodeAt(i);
            let n = code.toString(16);
            hex += n.length < 2 ? '0' + n : n;
        }
        return "0x" + hex;
    }

    public static toAscii(hex: string): string {
        if (!this.isHexString(hex))
            throw new Error("Invalid Hex String");
        let str = "";
        let i = 0, l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i+=2) {
            let code = parseInt(hex.substr(i, 2), 16);
            str += String.fromCharCode(code);
        }
        return str;
    }

    private static isHexString(value: string): boolean{
        const a = parseInt(value,16);
        return (a.toString(16) === value.toLowerCase());
    }

    public length():number {
        return this.value.length;
    }

    protected hexToBytes(hex, padding?: number): any[] {
        if (hex.startsWith("0x"))
            hex = hex.substr(2);
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));

        const i = this.bytesToHex(bytes);

        if (padding)
            for(let i=bytes.length;i<padding;i++)
                bytes.unshift(0);

        return bytes;
    }

    protected bytesToHex(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join("");
    }


    protected stringToBytes(value: string, padding?: number) {
        const hexValue = Web3.utils.fromAscii(value);
        return this.hexToBytes(hexValue, padding);
    }

    protected bytesToString(bytes: [], removePadding: boolean) {
        if (removePadding)
            bytes = bytes.reduce((array, byte ) => {
                if (byte != 0)
                    array.push(byte);
                return array;
            }, []);

        const hexValue = this.bytesToHex(bytes);
        return Web3.utils.toAscii("0x" + hexValue);
    }

    protected bytesToNumber(bytes: []){
        let val = 0;
        for (let i = 0; i < bytes.length; ++i) {
            val += bytes[i];
            if (i < bytes.length-1) {
                val = val << 8;
            }
        }
        return val;
    }

    protected numberToBytes(value: number): any[] {
        let bytes = [];
        let i = 4;
        do {
            bytes[--i] = value & (255);
            value = value>>8;
        } while (i);
        return bytes;
    }

    public getHex(root?: boolean): string {
        return "0x" + this.bytesToHex(this.value);
    }

    public valueOf() {
        return this.value;
    }

    public toString(){
        return this.getHex();
    }

}

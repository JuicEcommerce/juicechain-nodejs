//import * as qr from "qr-image";
//import * as fs from "fs"
export class Asset {

    public name: string;
    public publisher: string;
    public title: string;
    public amount: number;
    public type: string;
    public description: string;
    public valid: boolean;
    public master: boolean;
    public mediaUrl: string;
    public mediaType: string;
    public card: string;
    public issuer: string;

    public parse(obj: Asset): void {
        this.name = obj.name;
        this.publisher = obj.publisher;
        this.amount = obj.amount;

        this.type = obj.type;
        this.description = obj.description != undefined ? obj.description : "";

        this.mediaUrl = obj.mediaUrl;
        this.card = obj.card;
        this.issuer = obj.issuer;
    }
}
import {LocalizedString} from "../core/types/LocalizedString";

export class Asset {

    public id: string;

    // -- on chain properties ---
    public active: boolean;
    public quantity: number;
    public extended: string;
    public signature: string;
    public validation: number;
    public transferLock: number;

    // -- off chain properties
    public title: LocalizedString;
    public description: LocalizedString;
    public content: any;

    constructor(assetData?: any) {
        this.parse(assetData);
    }

    public parse(assetData: any) {
        this.id = assetData.id;

        this.active = assetData.active;
        this.quantity = assetData.quanity;
        this.extended = assetData.extended;
        this.signature = assetData.signature;
        this.validation = assetData.validation;
        this.transferLock = assetData.transferLock;

        this.title = assetData.title;
        this.description = assetData.description;
    }

}
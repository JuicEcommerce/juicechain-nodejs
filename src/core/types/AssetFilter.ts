export type AssetFilter = {
    archived?: boolean;
    type?: string;
    master?: boolean;
    root?: boolean;
    [key: string]: any;
}
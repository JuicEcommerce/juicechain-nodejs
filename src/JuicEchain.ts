import { AssetService } from "./services/AssetService";
import { JSONRequest } from "./helpers/JSONRequest";
import { resolve } from "path";
import { rejects } from "assert";

export class JuicEchain {

    private node: string;
    private username: string;
    private password: string;

    //private walletService: WalletService;
    private assetService: AssetService;
    //private nodeService: NodeService;

    constructor(node: string, username:string, password: string) {
        this.node = node;
        this.username = username;
        this.password = password;

        this.assetService = new AssetService(this);
    }

    public assets(): AssetService {
        return this.assetService;
    }

    public async requestGet(path: string) {
        let token: string = await this.requestToken();
        if (token == null) {
            throw new Error("NotAuthorizedException");
        }

        let _response: any = await JSONRequest.get(this.node, path, token);
        return _response;
    }

    public async requestPost(path: string, body: string, signature: string): Promise<any> { //change return type? throw errors
        let token: string = await this.requestToken();
        if (token == null) {
            throw new Error("NotAuthorizedException");
        }

        let _response: string = await JSONRequest.post(this.node, path, body, token, signature);
        return _response;
    }

    public async requestUpload(path: string, asset: string, file: Buffer) {
        let token: string = await this.requestToken();
        if (token == null) {
            throw new Error("NotAuthorizedException");
        }

        let _response: string = await JSONRequest.putMultipart(this.node, path, asset, file, token, "");
        return _response;
    }

    private async requestToken(): Promise<string> {
        let auth = {
            username: this.username,
            password: this.password
        };

        try {
            let result = await JSONRequest.post(this.node, "/auth", JSON.stringify(auth), "", "");
            if (result && result.success) {
                return result.token as string;
            } else {
                return null;
            }
        } catch (exception) {
            return exception;
        }
    }
}
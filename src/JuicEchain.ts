import { AssetService } from "./services/AssetService";
import { WalletService } from "./services/WalletService";
import { JSONRequest } from "./helpers/JSONRequest";

export class JuicEchain {

    private node: string;
    private username: string;
    private password: string;

    private walletService: WalletService;
    private assetService: AssetService;
    //private nodeService: NodeService;

    constructor(node: string, username:string, password: string) {
        this.node = node;
        this.username = username;
        this.password = password;
        this.walletService = new WalletService(this);
        this.assetService = new AssetService(this);
    }

    public wallets(): WalletService {
        return this.walletService;
    }

    public assets(): AssetService {
        return this.assetService;
    }

    public async requestGet(path: string): Promise<any> {
        let token: string = await this.requestToken();
        if (token == null) {
            throw new Error("NotAuthorizedException");
        }

        try {
            let _response: any = await JSONRequest.get(this.node, path, token);
            return _response;
        } catch(exception) {
            return exception;
        }
    }

    public async requestPost(path: string, body: any, signature: string): Promise<any> { //change return type? throw errors
        let token: string = await this.requestToken();
        if (token == null) {
            throw new Error("NotAuthorizedException");
        }

        try {
            let _response: any = await JSONRequest.post(this.node, path, body, token, signature);
            return _response;
        } catch(exception) {
            return exception;
        }
    }

    public async requestUpload(path: string, asset: string, file: Buffer): Promise<any> {
        let token: string = await this.requestToken();
        if (token == null) {
            throw new Error("NotAuthorizedException");
        }
        try {
            let _response: any = await JSONRequest.putMultipart(this.node, path, asset, file, token, "");
            return _response;
        } catch(error) {
            return error;
        }
    }

    private async requestToken(): Promise<string> {
        let auth = {
            username: this.username,
            password: this.password
        };

        try {
            let result = await JSONRequest.post(this.node, "auth", auth, "", "");
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
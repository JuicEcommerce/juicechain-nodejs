import {NotAuthorizedError} from "../errors/NotAuthorizedError";

const rp = require('request-promise');

export class RequestHelper {

    private node: string;
    private username: string;
    private apiKey: string;
    private nodeUri: string;

    constructor(node: string, username: string, apiKey: string, nodeUri?: string){
        this.node = node;
        this.username = username;
        this.apiKey = apiKey;
        this.nodeUri = nodeUri;
    }

    public async requestGet(path: string) {
        let token: string = await this.requestToken();
        return await this.get(this.node, path, token);
    }

    public async requestPost(path: string, body: any, authentication?: string): Promise<any> {
        let token: string = await this.requestToken();
        return await this.post(this.node, path, body, token, authentication);
    }

    public async requestPut(path: string, body: any, authentication: string): Promise<any> {
        let token: string = await this.requestToken();
        return await this.put(this.node, path, body, token, authentication);
    }

    public async requestUpload(path: string, asset: string, file: Buffer, target: string, style: string): Promise<any> {
        let token: string = await this.requestToken();
        return await this.putMultipart(this.node, path, asset, file, target, style, token, "");
    }

    private getNodeUrl(path: string): string{
        if (this.nodeUri){
            return this.nodeUri + "/" + path;
        } else {
            return 'https://' + this.node + '.juicechain.org/' + path
        }
    }

    private async requestToken(): Promise<string> {
        let auth = {
            username: this.username,
            key: this.apiKey
        };

        let result = await this.post(this.node, "node/auth", auth, "",  "");
        if (result && result.success) {
            return result.token;
        } else {
            throw new NotAuthorizedError("Invalid username and or password provided!");
        }
    }

    private async get(node: string, path: string, authorization: string): Promise<any> { //throw errors
       
        let options = {
            uri: this.getNodeUrl(path),
            method: 'GET',
            headers: {
                authorization: authorization
            },
            json: true
        };

        try {
            let result = await rp(options);
            if (result && result.success) {
                return result;
            }
            return null;
        } catch (exception){
            return exception;
        }
    }

    private async post(node: string, path: string, body: any, authorization: string, authentication: string): Promise<any> { //throw errors

        let options = {
            uri: this.getNodeUrl(path),
            method: 'POST',
            body: body,
            headers: {
                authorization: authorization,
                authentication: authentication
            },
            json: true
        };

        try {
            return await rp(options);
        } catch (exception){
            return exception;
        }
    }

    private  async put(node: string, path: string, body: any, authorization: string, authentication: string): Promise<any> { //throw errors

        let options = {
            uri: this.getNodeUrl(path),
            method: 'PUT',
            body: body,
            headers: {
                authorization: authorization,
                authentication: authentication
            },
            json: true
        };

        try {
            return await rp(options);
        } catch (exception){
            return exception;
        }
    }

    private async putMultipart(node: string, path: string, asset: string, buffer: Buffer,
                                     target: string, style: string, authorization: string, authentication: string): Promise<any> {
        
        let options = {
            uri: this.getNodeUrl(path),
            method: 'PUT',
            headers: {
                authorization: authorization,
                authentication: authentication,
                'content-type': 'multipart/form-data'
            },
            formData: {
                buffer: buffer == null ? Buffer.from([0]) : buffer,
                name: asset,
                target: target,
                style: style
            },
            json: true
        };

        try {
            let result: string = await rp(options);
            return result;
        } catch (exception){
            return exception;
        }
    }


}

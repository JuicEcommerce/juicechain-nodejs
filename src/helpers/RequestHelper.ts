import {NotAuthorizedError} from "../errors/NotAuthorizedError";

const rp = require('request-promise');

export class RequestHelper {

    private node: string;
    private username: string;
    private apiKey: string;

    constructor(node: string, username: string, apiKey: string){
        this.node = node;
        this.username = username;
        this.apiKey = apiKey;
    }

    public async requestGet(path: string) {
        let token: string = await this.requestToken();
        return await RequestHelper.get(this.node, path, token);
    }

    public async requestPost(path: string, body: any, authentication?: string): Promise<any> {
        let token: string = await this.requestToken();
        return await RequestHelper.post(this.node, path, body, token, authentication);
    }

    public async requestPut(path: string, body: any, authentication: string): Promise<any> {
        let token: string = await this.requestToken();
        return await RequestHelper.put(this.node, path, body, token, authentication);
    }

    public async requestUpload(path: string, asset: string, file: Buffer, target: string, style: string): Promise<any> {
        let token: string = await this.requestToken();
        return await RequestHelper.putMultipart(this.node, path, asset, file, target, style, token, "");
    }

    private async requestToken(): Promise<string> {
        let auth = {
            username: this.username,
            key: this.apiKey
        };

        let result = await RequestHelper.post(this.node, "node/auth", auth, "",  "");
        if (result && result.success) {
            return result.token;
        } else {
            throw new NotAuthorizedError("Invalid username and or password provided!");
        }
    }

    public static async get(node: string, path: string, authorization: string): Promise<any> { //throw errors
       
        let options = {
            uri: 'https://' + node + '.juicechain.org/' + path,
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

    public static async post(node: string, path: string, body: any, authorization: string, authentication: string): Promise<any> { //throw errors

        let options = {
            uri: 'https://' + node + '.juicechain.org/' + path,
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

    public static async put(node: string, path: string, body: any, authorization: string, authentication: string): Promise<any> { //throw errors

        let options = {
            uri: 'https://' + node + '.juicechain.org/' + path,
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

    public static async putMultipart(node: string, path: string, asset: string, buffer: Buffer,
                                     target: string, style: string, authorization: string, authentication: string): Promise<any> {
        
        let options = {
            uri: 'https://' + node + '.juicechain.org/' + path,
            method: 'PUT',
            headers: {
                authorization: authorization,
                authentication: authentication,
                'content-type': 'multipart/form-data'
            },
            formData: {
                buffer: buffer,
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

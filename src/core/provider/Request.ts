import {NotAuthorizedError} from "../errors/NotAuthorizedError";

const rp = require('request-promise');

export class Request {

    private apiKey: string;
    private hostUrl: string;
    private username: string;

    constructor(hostUrl: string, username: string, apiKey: string){
        this.hostUrl = hostUrl;
        this.username = username;
        this.apiKey = apiKey;
    }

    public async get(path: string, tokenRequired = true) {
        let token = null;
        if (tokenRequired) {
            token = await this.requestToken();
        }
        return await this.requestGet(path, token);
    }

    public async post(path: string, body: any, authentication?: string): Promise<any> {
        let token: string = await this.requestToken();
        return await this.requestPost(path, body, token, authentication);
    }

    public async put(path: string, body: any, authentication: string): Promise<any> {
        let token: string = await this.requestToken();
        return await this.requestPut(path, body, token, authentication);
    }

    public async putMultipart(path: string, file: Buffer, authentication: string): Promise<any> {
        let token: string = await this.requestToken();
        return await this.requestPutMultipart(path, file, token, authentication);
    }

    private async requestToken(): Promise<string> {
        let auth = {
            username: this.username,
            key: this.apiKey
        };

        let result = await this.requestPost("publisher/auth", auth, "", "");
        if (result && result.success) {
            return result.token;
        } else {
            throw new NotAuthorizedError("Invalid username and or password provided!");
        }
    }

    private async requestGet(path: string, authorization: string): Promise<any> { //throw errors
       
        let options = {
            uri: this.hostUrl + "/" + path,
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

    private async requestPost(path: string, body: any, authorization: string, authentication: string): Promise<any> { //throw errors

        let options = {
            uri: this.hostUrl + "/" + path,
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

    private async requestPut(path: string, body: any, authorization: string, authentication: string): Promise<any> { //throw errors

        let options = {
            uri: this.hostUrl + "/" + path,
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

    private async requestPutMultipart(path: string, buffer: Buffer, authorization: string, authentication: string): Promise<any> {
        
        let options = {
            uri: this.hostUrl + "/" + path,
            method: 'PUT',
            headers: {
                authorization: authorization,
                authentication: authentication,
                'content-type': 'multipart/form-data'
            },
            formData: {
                buffer: buffer == null ? Buffer.from([0]) : buffer,
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

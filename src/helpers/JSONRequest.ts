import { request } from 'http';
var rp = require('request-promise');

export class JSONRequest {

    public static async get(node: string, path: string, authorization: string): Promise<any> { //throw errors
       
        let options = {
            uri: 'https://' + node + '.juicechain.org/' + path,
            method: 'GET',
            resolveWithFullResponse: true
        }

        try {
            let result = await rp(options);
            console.log(result); //success is undefined in result?
            if (result && result.success) {
                return result;
            }
            return null;
        } catch (exception){
            return exception;
        }
    }

    public static async post(node: string, path: string, body: string, authorization: string, signature: string): Promise<any> { //throw errors

        let options = {
            uri: 'https://' + node + '.juicechain.org/' + path,
            method: 'POST',
            body: body,
            headers: {
                authorization: authorization,
                signature: signature
            },
            json: true
        }

        try {
            let result = await rp(options);
            return result;
            if (result && result.success) {
                return result;
            }
            return null;
        } catch (exception){
            return exception;
        }
    }

    public static async putMultipart(node: string, path: string, asset: string, buffer: Buffer, authorization: string, signature: string): Promise<any> {
        
        let options = {
            uri: 'https://' + node + '.juicechain.org/' + path,
            method: 'PUT',
            body: {    
            },
            headers: {
                authorization: authorization,
                signature: signature,
                'content-type': 'multipart/form-data'
            },
            formData: {
                buffer: buffer,
                name: asset
            }
        }

        try {
            let result: string = await rp(options);
            if (result && JSON.parse(result).success) {
                return result;
            }
            return null;
        } catch (exception){
            return exception;
        }
    }
}
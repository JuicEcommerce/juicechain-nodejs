var rp = require('request-promise');

export class JSONRequest {

    public static async get(node: string, path: string, authorization: string): Promise<any> {
       
        let options = {
            uri: 'https://' + node + '.juicechain.org/' + path,
            method: 'GET',
            headers: {
                authorization: authorization
            },
            json: true
        }

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

    public static async post(node: string, path: string, body: any, authorization: string, signature: string): Promise<any> {
        let options = {
            uri: 'https://' + node + '.juicechain.org/node/' + path,
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
            uri: 'https://' + node + '.juicechain.org/node/' + path,
            method: 'PUT',
            headers: {
                authorization: authorization,
                signature: signature,
                'content-type': 'multipart/form-data'
            },
            formData: {
                buffer: buffer,
                name: asset
            },
            json: true
        }

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
}
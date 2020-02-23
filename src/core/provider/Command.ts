import * as http from "http";
import * as https from "https";
import {Response} from "../types/Response";

export class Command{

    private readonly apiKey: string;
    private readonly nodeUri: string;
    private readonly payload: any;
    private readonly command: string;
    private readonly authentication: string;

    private commands: Array<{ command: string, authentication: boolean, baseNode: boolean }> = [{
        command: "create",
        authentication: false,
        baseNode: true
    }, {
        command: "balance",
        authentication: true,
        baseNode: true
    }, {
        command: "transfer",
        authentication: true,
        baseNode: true
    }, {
        command: "details",
        authentication: true,
        baseNode: false
    }, {
        command: "verify",
        authentication: false,
        baseNode: true
    }, {
        command: "nodes",
        authentication: false,
        baseNode: true
    }, {
        command: "restore",
        authentication: true,
        baseNode: true
    }, {
        command: "exchange",
        authentication: true,
        baseNode: false
    }, {
        command: "charge",
        authentication: true,
        baseNode: false
    }];

    constructor(command: string, payload: any, authentication: string, nodeUri: string, apiKey: string) {
        this.apiKey = apiKey;
        this.nodeUri = nodeUri;

        this.payload = payload;
        this.command = command;
        this.authentication = authentication;

        this.verifyCommand();
    }

    private verifyCommand(){
        const cmd = this.commands.find(command => {
            return command.command == this.command
        });
        if (!cmd)
            throw new Error("Invalid Command");
        if (cmd.authentication && !this.authentication)
            throw new Error("Command [" + this.command + "] requires authentication with a wallet");
    }

    private generateUrl(): string{
        // in case of details we  need to contact the respective assets node
        if (this.nodeUri.startsWith("http")) {
            // valid url pass through
            return this.nodeUri;
        } else if (this.nodeUri.split(".").length == 1){
            // generate default vnode url
            return "https://" + this.nodeUri + ".juicechain.org";
        } else {
            // only add protocol
            return "https://" + this.nodeUri;
        }
    }

    public execute():Promise<Response>{
        return new Promise((resolve, reject) => {

            const body = {
                command: this.command,
                payload: this.payload,
                authentication: this.authentication
            };

            const url = this.generateUrl();
            const port = url.startsWith("https") ? 443 : 80;

            const options = {
                hostname: url
                    .replace("https://", "")
                    .replace("http://", ""),
                path: '/wallet',
                port: 2500, //port,
                method: 'POST',
                headers: <any> {
                    "encryption": false,
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(JSON.stringify(body))
                }
            };

            if (this.apiKey)
                options.headers.authorization = this.apiKey;

            let data = '';
            const httpService = url.startsWith("https") ? https : http;

            // @ts-ignore
            const req = httpService.request(options, (res) => {
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    if (res.statusCode == 404) {
                        return reject(new Error("Authorization Failed."));
                    } else if (res.statusCode == 400){
                        return reject(new Error("Bad Request"));
                    } else if (res.statusCode == 200){
                        return resolve(JSON.parse(data));
                    } else {
                        return reject(new Error(data));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error("Failed connecting to Host"));
            });

            req.end(JSON.stringify(body));

        });
    }

}

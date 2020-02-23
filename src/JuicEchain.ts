import {Host} from "./core/Host";


export class JuicEchain {

    static getHost(hostUrl: string, username?: string, apiKey?: string): Host {
        return new Host(hostUrl, username, apiKey);
    }

}

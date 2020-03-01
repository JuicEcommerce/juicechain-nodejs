import {Host} from "./core/Host";
import {Publisher} from "./publisher/Publisher";
import {PublisherId} from "./core/types/PublisherId";


export class JuicEchain {

    static getHost(hostUrl: string, username?: string, apiKey?: string): Host {
        return new Host(hostUrl, username, apiKey);
    }

    static getPublisher(id: PublisherId, hostUrl: string, username: string, apiKey: string): Publisher {
        const host = this.getHost(hostUrl, username, apiKey);
        return new Publisher(host, id);
    }

    static getNode(nodeUrl: string) {
        throw new Error("Not implement");
    }

}

import {Node} from "./managed/Node";

export class JuicEchain {

    static getNode(node: string, username: string, apiKey: string):Node{
        return new Node(node, username, apiKey);
    }

}

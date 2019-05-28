import { JuicEchain } from "../JuicEchain";

export class NodeService {
    private juicechain: JuicEchain;

    constructor(juicechain: JuicEchain) {
        this.juicechain = juicechain;
    }
}
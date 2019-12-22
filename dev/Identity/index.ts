import Node from '../Crypt/index';
import * as path from 'path';
import * as fs from 'fs';
export default class Identity {
    private static hash: string = null;
    constructor(hash = Node.randomString(32)) {
        Identity.hash = hash;
    }
    public static of(hash: string):Identity {
        let p = path.join(path.dirname(require.main.filename), "../saved/entities/user/", hash, "user");
        return new Identity(fs.readFileSync(p).toString());
    }
}

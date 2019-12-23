import Node from '../Crypt/index';
import * as path from 'path';
import * as fs from 'fs';
interface IKeys {
    private: string;
}
export default class Identity {
    private hash: Buffer = null;
    private private: Buffer = null;

    constructor(
        username: string,
        pK = Buffer.from(Node.randomString(16), 'utf8')
    ) {
        this.hash = Buffer.from(username, 'utf8');
        this.private = pK;
        let o: IKeys = { private: this.private.toString('hex') };

        let identityRootFolder = path.join(
            path.dirname(require.main.filename),
            '../saved/entities/users/',
            this.hash.toString('hex')
        );

        let identityObjectPath = path.join(identityRootFolder, 'user');
        if (!fs.existsSync(identityRootFolder)) {
            fs.mkdirSync(identityRootFolder);
            let identitySafes = path.join(identityRootFolder, 'safes');
            if (!fs.existsSync(identitySafes)) fs.mkdirSync(identitySafes);
            if (!fs.existsSync(identityObjectPath)) {
                fs.writeFileSync(identityObjectPath, JSON.stringify(o));
            }
        } else {
            if (!fs.existsSync(identityObjectPath)) {
                fs.writeFileSync(identityObjectPath, JSON.stringify(o));
            }
        }
    }
    public getPrivateKey(): Buffer {
        return this.private;
    }
    public getPublicKey(): Buffer {
        return this.hash;
    }
    public static of(username: string): Identity {
        let h = Buffer.from(username, 'utf8').toString('hex');
        let p = path.join(
            path.dirname(require.main.filename),
            '../saved/entities/users/',
            h,
            'user'
        );
        if (fs.existsSync(p)) {
            return new Identity(
                username,
                JSON.parse(fs.readFileSync(p).toString()).private
            );
        } else {
            return null;
        }
    }
}

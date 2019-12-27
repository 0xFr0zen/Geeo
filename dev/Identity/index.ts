import Node from '../Crypt/index';
import * as path from 'path';
import * as fs from 'fs';
export default class Identity {
    private private: Buffer = null;
    private username: string = null;

    constructor(
        username: string,
        pK: Buffer = Buffer.from(Node.randomString(16), 'utf8')
    ) {
        this.username = username;
        this.private = pK;

        let identityRootFolder = path.join(
            process.cwd(),
            './saved/entities/users/',
            Buffer.from(this.username, 'utf8').toString('hex')
        );

        let identityObjectPath = path.join(identityRootFolder, 'user');
        if (!fs.existsSync(identityRootFolder)) {
            fs.mkdirSync(identityRootFolder);
            let identitySafes: string = path.join(identityRootFolder, 'safes');
            let identitySnapshots: string = path.join(
                identityRootFolder,
                'snapshots'
            );
            if (!fs.existsSync(identitySafes)) fs.mkdirSync(identitySafes);
            if (!fs.existsSync(identitySnapshots))
                fs.mkdirSync(identitySnapshots);
            if (!fs.existsSync(identityObjectPath)) {
                fs.writeFileSync(
                    identityObjectPath,
                    this.private.toString('hex')
                );
            }
        } else {
            if (!fs.existsSync(identityObjectPath)) {
                fs.writeFileSync(
                    identityObjectPath,
                    this.private.toString('hex')
                );
            }
        }
    }
    public getPrivateKey(): Buffer {
        return this.private;
    }
    public getUsername(): string {
        return this.username;
    }
    public static of(username: string): Identity {
        let h = Buffer.from(username, 'utf8').toString('hex');
        let p = path.join(
            process.cwd(),
            './saved/entities/users/',
            h,
            'user'
        );
        if (fs.existsSync(p)) {
            return new Identity(
                username,
                Buffer.from(fs.readFileSync(p).toString(), 'hex')
            );
        } else {
            return null;
        }
    }
    public toString(): string {
        let o = {
            private: this.private.toString('hex'),
            name: this.username,
        };
        return JSON.stringify(o);
    }
    public inspect():string {
        return this.toString();
    }
}

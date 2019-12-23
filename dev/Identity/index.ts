import Node from '../Crypt/index';
import * as path from 'path';
import * as fs from 'fs';
interface IKeys {
    private: string;
}
export default class Identity {
    private hash: string = null;
    private private: string = null;

    constructor(
        username: string,
        pK = Buffer.from(Node.randomString(16), 'utf8').toString('hex')
    ) {
        this.hash = Buffer.from(username, 'utf8').toString('hex');
        this.private = pK;
        let o = { private: this.private };
        let p = path.join(
            path.dirname(require.main.filename),
            '../saved/entities/users/',
            this.hash
        );
        let p2 = path.join(p, 'user');
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
            if(!fs.existsSync(p2)){
                fs.writeFileSync(p2, JSON.stringify(o));
            }
        } else {
            if (!fs.existsSync(p2)) {
                fs.writeFileSync(p2, JSON.stringify(o));
            }
        }
    }
    public getPrivateKey(): string {
        return this.private;
    }
    public getPublicKey(): string {
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
        if(fs.existsSync(p)){
            return new Identity(username, JSON.parse(fs.readFileSync(p).toString()).private);
        }else {
            return null;
        }
        
    }
}

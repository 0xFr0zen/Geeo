import Node from '../Crypt/index';
import * as path from 'path';
import * as fs from 'fs';
interface IKeys {
    private:string
}
export default class Identity {
    private hash: string = null;
    private private:string = null;
    
    constructor(hash = Node.randomString(32)) {
        this.hash = hash;
        this.private = Buffer.from(Node.randomString(16), 'utf8').toString('hex');
        let o = {private:this.private};
        let p = path.join(path.dirname(require.main.filename), "../saved/entities/users/", hash);
        let p2 = path.join(p,"user");
        if(!fs.existsSync(p)){
            fs.mkdirSync(p);
            
            fs.writeFileSync(p2, JSON.stringify(o));
        }else {
            if(!fs.existsSync(p2)){
                fs.writeFileSync(p2, JSON.stringify(o));
            }else {
                let i = Identity.of(hash);
                this.private = i.getPrivateKey();
            }
        }

        
    }
    public getPrivateKey():string {
        return this.private;
    }
    public getPublicKey():string {
        return this.hash;
    }
    public static of(hash: string):Identity {
        let p = path.join(path.dirname(require.main.filename), "../saved/entities/user/", hash, "user");
        return new Identity(fs.readFileSync(p).toString());
    }
}

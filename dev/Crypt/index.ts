import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import Entity from '../Entity/index';
export abstract class GeeoCypher {
    public static readonly algorithm = crypto.getCiphers()[0];
    private static readonly cipherJSON = JSON.parse(
        fs
            .readFileSync(
                path.join(
                    path.dirname(require.main.filename),
                    '../dev/.geeocipher'
                )
            )
            .toString()
    );
    
    private static readonly iv = crypto.randomBytes(16);
    private static readonly cipher = {
        password: GeeoCypher.cipherJSON.p,
    };
    public static getCipher(): any {
        //Still exploitable need to find a way to access only node for it

        return GeeoCypher.cipher;
    }
    public static getIV(): any {
        
        return GeeoCypher.iv;
    }
}
export default class Node {
    private privateValue: string = null;
    private publicValue: string = '';
    private key: crypto.Cipher = null;
    constructor(data: any) {
        let m = crypto.createHash('md5');
        m.update(GeeoCypher.getCipher().password);
        this.key = crypto.createCipheriv(
            GeeoCypher.algorithm,
            m.digest(),
            GeeoCypher.getIV()
        );

        this.update(data);
    }
    public update(data: any) {
        let buffered = Buffer.from(data.toString(),'utf8').toString('base64');
        this.publicValue = this.key
            .update(buffered, 'utf8', 'hex')
            .concat(this.key.final('hex'));
        //crypted result stored
    }
    public toString(): string {
        return this.publicValue;
    }
    public inspect(): string {
        return this.toString();
    }
}
export class Edon {
    private privateValue: string = null;
    private key: crypto.Decipher = null;
    constructor(data: any) {
        var m = crypto.createHash('md5');
        m.update(GeeoCypher.getCipher().password);
        this.key = crypto.createDecipheriv(
            GeeoCypher.algorithm,
            m.digest(),
            GeeoCypher.getIV()
        );
        let b = Buffer.from(data, 'hex');

        this.privateValue = Buffer.from(this.key
            .update(b, 'hex', 'utf8')
            .concat(this.key.final('utf8')),'base64').toString('utf8');
    }
    public toString(): string {
        return this.privateValue;
    }
}

import encryptText from './encrypt';
import decryptText from './decrypt';
import * as crypto from 'crypto';
interface IKeys {
    publicKey: Buffer;
    privateKey: Buffer;
}
interface ItoString {
    data: string;
    keys: IKeys;
}
export default class Node {
    private data: string = null;
    private privatekey: Buffer = null;
    private publickey: Buffer = null;
    private encoding: crypto.HexBase64BinaryEncoding = 'hex';
    private static a: string[] = '1234567890abcdef'.split('');
    constructor(
        data: string,
        keys: IKeys = {
            privateKey: Buffer.from(Node.randomString(16)),
            publicKey: Buffer.from(Node.randomString(16)),
        }
    ) {
        this.publickey = keys.publicKey;
        this.privatekey = keys.privateKey;
        this.data = data;
    }
    public getKey(keyname: string): string {
        let result = null;
        switch (keyname) {
            case 'private':
                result = this.privatekey.toString('utf8');
                break;
            case 'public':
                result = this.publickey.toString('utf8');
                break;
            default:
                break;
        }
        return result;
    }
    public encryptText(): string {
        return encryptText(this.data, this.publickey, this.privatekey);
    }
    public decryptText(): string {
        return decryptText(this.data, this.publickey, this.privatekey);
    }
    public static randomString(hash_length: number) {
        let ar: string[] = Node.a;
        let result = '';
        let length = ar.length;
        for (let i = 0; i < hash_length; i++) {
            let r = Math.floor(Math.random() * (length - 1));
            let letter = ar[r];
            result = result.concat(letter);
        }
        return result;
    }
    public toString(): string {
        let obj: ItoString = {
            data: this.encryptText(),
            keys: { privateKey: this.privatekey, publicKey: this.publickey },
        };
        return JSON.stringify(obj);
    }
}

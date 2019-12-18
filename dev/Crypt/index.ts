import * as crypto from 'crypto';
interface IKeyIV {
    key: Buffer;
    iv: Buffer;
}
export default class Node {
    
    private priv: string = null;
    private iv: Buffer = null;
    private key: Buffer = null;
    private encoding: crypto.HexBase64BinaryEncoding = 'hex';
    constructor(data: string, givenkeyiv?: IKeyIV) {
        let keyiv = this.getKeyAndIV('geeopenetrator');

        this.key =
            typeof givenkeyiv !== 'undefined'
                ? Buffer.from(givenkeyiv.key)
                : keyiv.key;
        this.iv =
            typeof givenkeyiv !== 'undefined'
                ? Buffer.from(givenkeyiv.iv)
                : keyiv.iv;

        if (!givenkeyiv) {
            this.priv = this.encryptText(
                'aes-128-cbc',
                this.key,
                this.iv,
                data,
                this.encoding
            );
        } else {
            this.priv = Buffer.from(
                this.decryptText(
                    'aes-128-cbc',
                    this.key,
                    this.iv,
                    data,
                    this.encoding
                )
            ).toString('utf8');
        }
    }
    static from(json: any): Node {
        
        return new Node(json.data, {key:json.key, iv:json.iv});
    }
    private getKeyAndIV(key: any): any {
        let result: any = {
            iv: null,
            key: null,
        };
        let ivBuffer = crypto.randomBytes(16);
        let keyBuffer = key instanceof Buffer ? key : Buffer.alloc(16, key);
        result.key = keyBuffer;
        result.iv = ivBuffer;
        return result;
    }

    private encryptText(
        cipher_alg: string,
        key: Buffer,
        iv: Buffer,
        text: string,
        encoding?: crypto.HexBase64BinaryEncoding
    ) {
        let cipher = crypto.createCipheriv(cipher_alg, key, iv);

        encoding = encoding || 'binary';

        let result = cipher.update(text, 'utf8', encoding);
        result += cipher.final(encoding);

        return this.toBase64(result);
    }

    private decryptText(
        cipher_alg: string,
        key: Buffer,
        iv: Buffer,
        text: string,
        encoding?: crypto.HexBase64BinaryEncoding
    ) {
        let decipher = crypto.createDecipheriv(cipher_alg, key, iv);

        encoding = encoding || 'binary';

        let result: any = decipher.update(this.toHex(text), encoding);
        result += decipher.final('utf8');

        return result;
    }
    public toString(): string {
        let json = { key: this.key, iv: this.iv, data: this.priv };
        let result = JSON.stringify(json);
        return result;
    }
    private toBase64(text:string):string {
        return Buffer.from(text, 'hex').toString('base64');
    }
    private toHex(text:string):string {
        return Buffer.from(text, 'base64').toString('hex');
    }
}

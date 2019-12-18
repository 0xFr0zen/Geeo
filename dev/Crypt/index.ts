import * as crypto from 'crypto';
interface IKeyIV {
    key: Buffer;
    iv: Buffer;
}
export default class Node {
    private priv: string = null;
    private iv: Buffer = null;
    private key: Buffer = null;
    constructor(data: string, givenkeyiv?: IKeyIV) {
        let keyiv = this.getKeyAndIV('geeopenetrator');
        
        this.key = (typeof givenkeyiv !== 'undefined') ? Buffer.from(givenkeyiv.key): keyiv.key;
        this.iv = (typeof givenkeyiv !== 'undefined') ? Buffer.from(givenkeyiv.iv): keyiv.iv;
        
        if (!givenkeyiv) {
            this.priv = this.encryptText(
                'aes-128-cbc',
                this.key,
                this.iv,
                data
            );
        } else {
            this.priv = Buffer.from(
                this.decryptText('aes-128-cbc', this.key, this.iv, data)
            ).toString('utf8');
        }
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

        return result;
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

        let result: any = decipher.update(text, encoding);
        result += decipher.final('utf8');

        return result;
    }
    public toString(): string {
        return JSON.stringify({ key: this.key, iv: this.iv, data: this.priv });
    }
}

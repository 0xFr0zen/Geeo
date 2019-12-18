import * as crypto from 'crypto';
export default class Node {
    private priv: string = null;
    constructor(data: string, decrypt = false) {
        let me = this;

        let keyiv = this.getKeyAndIV('geeopenetrator');
        if (!decrypt) {
            this.priv = me.encryptText(
                'aes-128-cbc',
                keyiv.key,
                keyiv.iv,
                data,
                'base64'
            );
        } else {
            this.priv = Buffer.from(
                me.decryptText(
                    'aes-128-cbc',
                    keyiv.key,
                    keyiv.iv,
                    data,
                    'base64'
                ),
                'base64'
            ).toString('utf8');
        }
    }
    private getKeyAndIV(key: any):any {
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
        encoding: crypto.HexBase64BinaryEncoding
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
        encoding: crypto.HexBase64BinaryEncoding
    ) {
        let decipher = crypto.createDecipheriv(cipher_alg, key, iv);

        encoding = encoding || 'binary';

        let result: any = decipher.update(text, encoding);
        result += decipher.final('utf8');

        return result;
    }
    public toString(): string {
        return this.priv;
    }
}

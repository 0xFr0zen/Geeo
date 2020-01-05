import * as crypto from 'crypto';

function decryptText(
    text: string,
    key: Buffer,
    iv: Buffer,
    encoding: crypto.HexBase64BinaryEncoding = 'hex'
): string {
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);

    encoding = encoding || 'binary';

    let result: any = decipher.update(toHex(text), encoding);
    result += decipher.final('utf8');

    return result;
}
function toHex(text: string): string {
    return Buffer.from(text, 'base64').toString('hex');
}
export default decryptText;

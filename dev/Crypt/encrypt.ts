import * as crypto from 'crypto';

function encryptText(
    text: string,
    key: Buffer,
    iv: Buffer,
    encoding: crypto.HexBase64BinaryEncoding = 'hex'
):string {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

    encoding = encoding || 'binary';

    let result = cipher.update(text, 'utf8', encoding);
    result += cipher.final(encoding);

    return toBase64(result);
}
function toBase64(text:string):string {
    return Buffer.from(text, 'hex').toString('base64');
}
export default encryptText;

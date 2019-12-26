import Device from './dev/Device/index';
import User from './dev/User/index';
import decryptText from './dev/Crypt/decrypt';
let i = Device.createIdentity('oezguer');
// let text = "";
// let j = JSON.parse(decryptText(text, Device.getPublicKey(), Device.getIdentity('oezguer').getPrivateKey()));
// console.log();

let u = User.from(i);
// console.log(u.toString());
console.log(`created  @ ${u.getCreated()}`);
console.log(u.getSafes());

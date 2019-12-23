import User from './dev/User/index';
import Identity from './dev/Identity/index';
import Safe from './dev/Safe/index';
import * as fs from 'fs';
import * as path from 'path';
import Node from './dev/Crypt/index';
import Device from './dev/Device/index';

// let username = 'oezguer';
// if(!User.exists(username)){
//     let oe = User.create(username);
// }else {
//     let oe = User.from(Identity.of(username).getPublicKey());

// }
// let f = JSON.parse(fs.readFileSync(path.join(path.dirname(require.main.filename),"../saved/entities/users/6f657a67756572/safes/1495ea1b0a19375e")).toString());

// let prK = Buffer.from(JSON.parse(fs.readFileSync(path.join(path.dirname(require.main.filename),"../saved/entities/users/6f657a67756572/user")).toString()).private, 'hex');
// let pbK = Buffer.from("1495ea1b0a19375e", 'hex');
// console.log(JSON.parse(new Node(f.data, {privateKey:prK, publicKey:pbK}).decryptText()));

// console.log(Safe.from());

// oe.save();

console.log(Device.getPrivateKey());

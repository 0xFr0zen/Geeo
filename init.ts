import Device from './dev/Device/index';
import User from './dev/User/index';
import decryptText from './dev/Crypt/decrypt';
let text = "iMXQ+QWQtJhJoXUHMJcrbIpXnvMuk8/csg+qHdM94nDT4occ4uSHlTcZwAxYf6jHB3LMkLBFvMValMwnb2jVrP6C3F1Xgl7+I6z+JkblU9dFFu1qiJV5g+8b7FBTNJBSLvvMzvc0fiYcJtDguX2nDPWliGgyR7GfYaJJZz093Xl7ao7Cp4Ifqw34MsNmSPapT+DcnrL945r+5ub9B2R8uix34MIDMMZNadN9xJMxS3F+jx6cgmpnCHtZwVVEwtyTthwl27A+Jv515HZONNhNfQ==";
let j = JSON.parse(decryptText(text, Device.getPublicKey(), Device.getIdentity('oezguer').getPrivateKey()));
console.log();

// let u = User.from(Device.createIdentity('oezguer'));
// // console.log(u.toString());
// console.log(`created  @ ${u.getCreated()}`);
// console.log(u.getSafes());

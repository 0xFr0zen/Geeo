import Device from './dev/Device/index';
import User from './dev/User/index';
// Device.hasIdentity('none'); // initalizes
let u = User.from(Device.createIdentity('oezguer'));
console.log(u);

console.log(u.getCreated());
// let s = {"key":"s"};
// let s2 = {"key":1,"key2":"s"};
// console.log(compareEntities(s,s2));

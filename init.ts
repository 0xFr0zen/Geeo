import Device from './dev/Device/index';
import User from './dev/User/index';

let u = User.from(Device.createIdentity('oezguer'));
console.log(u.toString());
console.log(u.getCreated());
console.log(u.getSafes());

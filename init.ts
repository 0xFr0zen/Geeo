import Device from './dev/Device/index';
import User from './dev/User/index';
import compareEntities from './dev/Entity/Comparison/index';
User.from(Device.createIdentity('oezguer'));
// let s = {"key":"s"};
// let s2 = {"key":1,"key2":"s"};
// console.log(compareEntities(s,s2));

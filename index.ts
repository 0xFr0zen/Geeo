import User from './dev/System/Entity/User';
import Safe, { StorageType } from './dev/System/Entity/Safe';
import System from './dev/System/index';

let system = new System();
system.on('ready', port => {
    console.log('system is running on port: ' + port);
});
// User.create('admin2', '123456', {
//     firstname: 'myfirstnameadmin',
//     lastname: 'mylastnameadmin',
//     email: 'idonthaveanyemail@gmail.com',
//     created: new Date(Date.now()),
// });
// User.findFirst({ username: 'admin' })
//     .then(user => {
//         console.log(user);
//     })
//     .catch(e => {
//         console.error(e);
//     });

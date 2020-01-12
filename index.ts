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
// User.find({ username: 'admin' })
//     .then(users => {
//         console.log(users);
//     })
//     .catch(e => {
//         console.error(e);
//     });

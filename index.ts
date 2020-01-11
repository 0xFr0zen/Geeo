import User from './dev/System/Entity/User';
import Safe, { StorageType } from './dev/System/Entity/Safe';
import Database from './dev/Database';
import Queries from './dev/Database/Queries';

// let x = User.create('myname', 'mypassword', {
//     firstname: 'myfirstname',
//     lastname: 'mylastname',
//     email: 'myemail@gmail.com',
//     created: new Date(Date.now()),
// });
let db = new Database('geeo');
db.query(Queries.DATABASES.SHOW)
    .then(results => {
        results.forEach(result=> {
            console.log(result.getRow('Database'));
        })
       db.close(); 
    })
    .catch(err => {
        console.log(err);
    });
// User.find('admin', db)
//     .then(user => {
//         user.addSafe(
//             new Safe(user.getName(), 'default', StorageType.Inventory)
//         );
//         console.log(user);

//         db.close();
//     })
//     .catch(e => {
//         console.error(e);
//     });

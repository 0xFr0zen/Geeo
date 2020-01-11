import User from './dev/System/Entity/User';
import Safe, { StorageType } from './dev/System/Entity/Safe';
import Database from './dev/Database';
let db = new Database('geeo');

User.find('admin', db)
    .then(user => {
        user.addSafe(
            new Safe(user.getName(), 'default', StorageType.Inventory)
        );
        console.log(user);

        db.close();
    })
    .catch(e => {
        console.error(e);
    });

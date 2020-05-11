import User from '../dev/system/Entity/User/index';
import Safe from '../dev/System/Entity/Safe';
let demouser: User = User.demo();

demouser
    .getSafe('demosafe')
    .then((safe) => {
        console.log(safe);
    })
    .catch((e) => {
        console.log(e);
    });

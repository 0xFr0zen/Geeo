import User from '../dev/system/Entity/User/index';
let demouser: User = User.demo();
//DB resends queries. check that pls tests/log.txt
demouser
    .getSafes()
    .then((safe) => {
        console.log(safe);
    })
    .catch((e) => {
        console.log(e);
    });

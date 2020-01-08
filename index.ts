import System from './dev/System';
import Entity from './dev/System/Entity';
import User from './dev/System/Entity/User';
import Safe, { StorageType } from './dev/System/Entity/Safe';


(async ()=>{

    let e1 = new User("admin");
    e1.addSafe(new Safe(e1.getName(),"default", StorageType.Inventory))
    console.log(e1);
    
    // let system:System = new System();
    // system.on('ready', (port) => {
    //     console.log(`Running Web-Server + Auth-Server on port: ${port}`);
    // });
})();

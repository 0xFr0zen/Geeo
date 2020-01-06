import System from './dev/system';
import Auth from './dev/auth/index';


(async ()=>{
    let system:System = new System();
    system.on('ready', (port) => {
        console.log(`Running Web-Server on port: ${port}`);
    });
    let authenticator:Auth = new Auth();
    authenticator.on('ready', (port) => {
        console.log(`Running Auth-Server on port: ${port}`);
    });
})();

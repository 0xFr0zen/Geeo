import System from './dev/system';


(async ()=>{
    let system:System = new System();
    system.on('ready', (port) => {
        console.log(`Running Web-Server + Auth-Server on port: ${port}`);
    });
})();

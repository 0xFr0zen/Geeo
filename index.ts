import System from './dev/system/index';


(async ()=>{
    let system:System = new System();
    system.on('ready', () => {
        console.log("System is running.");
    });
    
})();

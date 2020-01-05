import System from './dev/System/index';


(async ()=>{
    let system:System = new System();
    system.on('ready', () => {
        console.log("System running.");
    });
})();

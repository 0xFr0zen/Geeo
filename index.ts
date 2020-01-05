import System from './dev/system/index';


(async ()=>{
    console.log("hello");
    let system:System = new System();
    system.on('ready', () => {
        console.log("System running.");
    });
})();

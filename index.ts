import System from './dev/system';
import GUI from './dev/system/GUI';


let system:System = new System();
system.on('ready', () => {
    console.log("System running.");
});

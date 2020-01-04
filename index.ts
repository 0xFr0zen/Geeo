import System from './dev/System';
import GUI from './dev/GUI';


let system:System = new System();
system.on('ready', () => {
    console.log("System running.");
});
system.run();

import System from './dev/System';
import ConsoleIO from './dev/ConsoleIO';


let system:System = new System();
system.on('ready', function(){
    let consoleIO:ConsoleIO = new ConsoleIO();
})

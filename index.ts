import System from './dev/System/index';

let system = new System();
system.on('ready', (port) => {
    console.log('system is running on port: ' + port);
});
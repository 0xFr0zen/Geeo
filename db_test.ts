import Initializer from './dev/Database/initializie';
Initializer.initialize().then(ni => console.log(`Added stuff: ${ni}`)).catch((e)=>{console.error(e);});
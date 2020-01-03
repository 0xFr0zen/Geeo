import { CommandInterface } from '../index';
import ConsoleIO from '../..';
import System from '../../../System';
export default class GUI implements CommandInterface {
    run(whatev: any, filter?: any[]) {
        let system:System = ConsoleIO.getSystem();
        // console.log(whatev)
        if(whatev === "show"){
            system.showWindow();
        }else if(whatev === "hide"){
            system.hideWindow();
        }else {

        }
    }
}

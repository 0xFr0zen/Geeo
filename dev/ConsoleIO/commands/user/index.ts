import { CommandInterface } from '../index';
import ConsoleIO from '../..';
import System from '../../../System';
export default class USER implements CommandInterface {
    run(task: any, filter?: any) {
        console.log(task, filter);
        
    }
}

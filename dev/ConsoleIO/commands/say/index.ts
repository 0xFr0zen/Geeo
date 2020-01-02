import { CommandInterface } from '../index';
export default class Say_Text implements CommandInterface {
    run(parameter: any, optionals: any[]) {
        console.log(parameter);
    }
    
}
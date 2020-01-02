import { CommandInterface } from '../index';
import ConsoleIO from '../..';
export default class GET implements CommandInterface {
    run(type: any, filter: any[]) {
        let searchTag = type.toString();
        let jsonString = filter.toString();
        if(this.isJson(jsonString)){
            let userJSON = JSON.parse(jsonString);
            console.log(searchTag, userJSON);
        }else {
            ConsoleIO.error("Syntax Error, JSON is not compatible.");
        }
    }
    private isJson(str:string):boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}
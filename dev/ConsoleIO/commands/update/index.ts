import { CommandInterface } from '../index';
import ConsoleIO from '../..';
export default class UPDATE implements CommandInterface {
    run(version: any, filter?: any[]) {
        ConsoleIO.log(version.toString());
    }
}

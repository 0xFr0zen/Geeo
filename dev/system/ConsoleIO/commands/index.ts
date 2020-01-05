import { EventEmitter } from 'events';
export interface CommandInterface<T> {
    run(parameter: any, optionals?: any): Promise<T>;
}
export default class Command<T> extends EventEmitter
    implements CommandInterface<T> {
    constructor() {
        super();
    }
    run(parameter: any, optionals: any): Promise<T> {
        console.log("logging command into log file");
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}

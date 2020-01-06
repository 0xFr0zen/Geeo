import { EventEmitter } from 'events';
export interface CommandInterface<T> {
    readonly regex: string;
    run(parameter: any, optionals?: any): Promise<T>;
}
export default class Command<T> extends EventEmitter
    implements CommandInterface<T> {
    regex: string = '';
    constructor() {
        super();
    }
    async run(parameter: any, optionals: any): Promise<T> {
        console.log('logging command into log file');
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}

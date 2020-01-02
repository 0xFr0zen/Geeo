export interface CommandInterface {
    run(parameter:any, optionals:any[]):void;
}
export default class Command implements CommandInterface {
    constructor() {
        
    }
    run(parameter: any, optionals: any[]): void {
        
    }
}
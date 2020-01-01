import System from '../System';
import * as readline from 'readline';
import * as inquirer from 'inquirer';

export default class ConsoleIO {
    private handler: NodeJS.Timeout = null;
    private interface: readline.Interface = null;
    constructor() {
        // let stdin = process.openStdin();
        this.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        // stdin.addListener("data", (d)=>{this.parse(d.toString().trim())});
        this.interface.question("Hey, whats up?",(answer)=>{console.log(answer)});
        this.interface.on('line', this.parse);
        
    }
    private parse(message: string): void {
        this.interface.write("got message: '" + message + "'");
    }
    public exec(command: string, parameters?: any[][]): void {
        let output: string = '';
        if (parameters) {
            let params = parameters[0];
            let optional = parameters[1];
            output = `command: '${command}'\nparameters:\n\tparam:${parameters[0]}\n\toptional:${parameters[1]}`;
        } else {
            output = `command: '${command}'`;
        }
        console.log(output);
    }
}

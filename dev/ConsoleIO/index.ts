import System from '../System';
import * as readline from 'readline';
import * as inquirer from 'inquirer';
import RegExpParser from './RegExpParser';
export interface ICommand {
    name: string;
    regex: RegExp;
}
export default class ConsoleIO {
    private interface: readline.Interface = null;
    private commands: ICommand[] = [
        {
            name: 'say_text',
            regex: RegExpParser('say <text:any>'),
        },
    ];
    constructor() {
        this.interface = readline.createInterface({
            input: process.openStdin(),
            output: process.stdout,
            terminal: true,
        });
        let me = this;
        // this.interface.question("Hey, whats up?",(answer)=>{console.log(answer)});
        this.interface = this.interface.addListener('line', function(
            message: string
        ) {
            me.parse(message.trim());
        });
    }
    private parse(message: string): void {
        if (message.length == 0) {
        } else {
            let command = this.commands.find((command: ICommand) => {
                return command.regex.test(message);
            });
            if (command != null) {
                console.log(command.regex);
                
                let m:RegExpExecArray = null;
                while ((m = command.regex.exec(message)) !== null) {
                    console.log(m);
                    
                }
                console.log(m);
            }else {
                console.log("Couldnt find the command you typed.");
            }
        }
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

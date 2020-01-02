import System from '../System';
import * as readline from 'readline';
import * as inquirer from 'inquirer';
import RegExpParser from './RegExpParser';
import Command from './commands/index';
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
        {
            name: 'get',
            regex: RegExpParser('get <text:text> <filter:array>'),
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
                let x = message.match(command.regex)[1]; // initializer somehow, DO NOT ERASE. PROGRAM CRASHES IF YOU DELETE.
                let m: any = command.regex.exec(message);
                let params = m[1] || null;
                let optionals = m[2] || null;
                if (params != null || optionals != null) {
                    this.exec(command.name, [params, optionals]);
                } else {
                    this.exec(command.name);
                }
            } else {
                console.log('Couldnt find the command you typed.');
            }
        }
    }
    public exec(command: string, parameters?: any[]): void {
        if (parameters) {
            let params = parameters[0];
            let optional = parameters[1];
            let com = require(`./commands/${command}/`);
            let comJS = new com.default();            
            comJS.run(params, optional);
        } else {
        }
    }
}

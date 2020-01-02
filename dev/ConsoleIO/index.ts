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
    private static interface: readline.Interface = null;
    private commands: ICommand[] = [
        {
            name: 'say',
            regex: RegExpParser('say <text>'),
        },
        {
            name: 'get',
            regex: RegExpParser('get <text> <json>'),
        },
    ];
    constructor() {
        ConsoleIO.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            removeHistoryDuplicates: true,
            historySize: 100,
            terminal: true,
        });
        let me = this;

        ConsoleIO.interface = ConsoleIO.interface.addListener('line', function(
            message: string
        ) {
            me.parse(message.trim());
        });
    }
    private parse(message: string): void {
        if (message.length == 0) {
        } else {
            if (message === 'clear') {
                ConsoleIO.clear();
            }

            let command: ICommand = null;
            while ((command = this.getCommand(message)) !== null) {
                let x = message.match(command.regex)[1]; // initializer somehow, DO NOT ERASE. PROGRAM CRASHES IF YOU DELETE.
                let m: any = command.regex.exec(message);
                let params = m[1] || null;
                let optionals = m[2] || null;
                if (params != null || optionals != null) {
                    this.exec(command.name, [params, optionals]);
                } else {
                    this.exec(command.name);
                }
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
    private getCommand(message: string) {
        let res: ICommand = null;
        this.commands.forEach(element => {
            if (element.regex.test(message)) {
                res = element;
            }
        });
        return res;
    }
    public static error(text: string) {
        ConsoleIO.log(text);
    }
    public static info(text: string) {
        ConsoleIO.log(text);
    }
    public static clear() {
        console.clear();
    }
    public static log(text: string) {
        ConsoleIO.interface.write(text);
    }
}

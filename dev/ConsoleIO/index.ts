import System from '../System';
import * as readline from 'readline';
import * as inquirer from 'inquirer';
import Command from './commands/';
import * as fs from 'fs';
import * as path from 'path';
interface ICommandRegExp {
    start:number;
    exp:RegExp;
}
export interface ICommand {
    name: string;
    regex: ICommandRegExp;
}
export default class ConsoleIO {
    private static loadCommands(): ICommand[] {
        let result: ICommand[] = [];
        let x = JSON.parse(
            fs
                .readFileSync(
                    path.join(
                        process.cwd(),
                        './dev/ConsoleIO/commands/list.json'
                    )
                )
                .toString()
        );
        for (const key in x) {
            const element = x[key];
            let c: ICommand = {
                name: element.name,
                regex: ConsoleIO.RegExpParser(element.regex),
            };
            result.push(c);
        }
        return result;
    }
    private static interface: readline.Interface = null;
    private commands: ICommand[] = ConsoleIO.loadCommands();
    private static system: System = null;
    constructor(system: System) {
        ConsoleIO.system = system;
        ConsoleIO.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            removeHistoryDuplicates: true,
            historySize: 100,
            terminal: true,
        });
        let me = this;

        ConsoleIO.interface = ConsoleIO.interface.addListener(
            'SIGINT',
            function(message: string) {
                process.exit(0);
            }
        );

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
                let x = message.match(command.regex.exp)[1]; // initializer somehow, DO NOT ERASE. PROGRAM CRASHES IF YOU DELETE.
                let m: any = command.regex.exp.exec(message);
                let starter = command.regex.start;
                console.log(starter)
                let params = m[starter] || null;
                let optionals = m[starter] || null;
                if (params != null || optionals != null) {
                    this.exec(command.name, [params, optionals]);
                } else {
                    this.exec(command.name);
                }
            }
        }
    }
    private exec(command: string, parameters?: any[]): void {
        if (parameters) {
            let params = parameters[0];
            let optional = parameters[1];
            let com = require(`./commands/${command}/`);
            let comJS: Command<any> = new com.default();
            comJS.on('done', () => {
                // console.log(`executed command '${command}'`);
            });
            comJS.run(params, optional).then((obj) => {
                console.log(obj);
            });
        } else {
        }
    }
    public static getSystem(): System {
        return ConsoleIO.system;
    }
    private getCommand(message: string) {
        let res: ICommand = null;
        this.commands.forEach(element => {
            if (element.regex.exp.test(message)) {
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
    private static RegExpParser(s: string): ICommandRegExp {
        let result: ICommandRegExp;
        let res: string = '^';
        let splitted = s.split(' ');
        if (splitted.length == 0) {
            result = null;
        } else {
            let starter = 2;
            splitted.forEach((item: string) => {
                let isOptional = item.includes('?');
                let stringAdd = '';
                if (item.startsWith('<') && item.endsWith('>')) {
                    let match = item.substring(1, item.length - 1).split(':');
                    let type = match[0];

                    if (isOptional) {
                        let spl = type.split('?');
                        type = spl[1];
                    }

                    let length = '';
                    if (match.length == 2) {
                        length = match[1];
                    }
                    let typer = '';
                    switch (type) {
                        case 'any':
                            typer = '.*';
                            break;
                        case 'number':
                            typer = '\\d+';
                            break;
                        case 'dnumber':
                            typer = '\\d+[\\.\\,]\\d+';
                            break;
                        case 'text':
                            typer = '([\"\'])((?:\\\\1|.)*?)\\1';
                            starter = 3;
                            break;
                        case 'json':
                            typer = '\\{.*\\}';
                            break;
                        default:
                            break;
                    }
                    stringAdd = `${isOptional ? '(?:' : ''}(${typer})${length}${
                        isOptional ? ')?' : ''
                    }`;
                } else {
                    stringAdd = `(?:${item}\\s+)`;
                }
                if (splitted.indexOf(item) == 0) {
                } else if (splitted.indexOf(item) != splitted.length - 1) {
                    stringAdd = stringAdd + '\\s+';
                } else if (isOptional) {
                    res = res.substring(0, res.length - 3);
                    let sA = stringAdd.split(':');
                    stringAdd = sA[0].concat(':\\s+').concat(sA[1]);
                } else {
                    //last item
                }
                res = res.concat(stringAdd);
            });
            res = res.concat('$');
            result = {start: starter, exp:new RegExp(res, 'gi')};
        }

        return result;
    }
}

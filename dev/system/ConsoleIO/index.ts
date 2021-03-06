import System from '..';
import readline from 'readline';
import inquirer from 'inquirer';
import Command from './commands';
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import dotenv from 'dotenv';
import equal = require('deep-equal');
interface ICommandRegExp {
    start: number;
    exp: RegExp;
}
export interface ICommand {
    name: string;
    regex: ICommandRegExp;
}
export default class ConsoleIO extends EventEmitter {
    private updateInterval: NodeJS.Timeout;

    private static interface: readline.Interface = null;
    private commands: ICommand[] = ConsoleIO.loadCommands();
    private static system: System = null;
    private static DEFAULT_UPDATE_INTERVAL =
        parseInt(dotenv.config().parsed.COMMAND_UPDATE_INTERVAL) * 1000 ||
        60000;
    constructor(system: System) {
        super();
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
            (message: string) => {
                clearInterval(this.updateInterval);
                console.log('Closing programm, see you next time!');
                process.exit(0);
            }
        );

        ConsoleIO.interface = ConsoleIO.interface.addListener(
            'line',
            (message: string) => {
                this.parse(message.trim());
            }
        );
        this.on('update', this.updater);
        this.updateInterval = setInterval(
            () => this.emit('update'),
            ConsoleIO.DEFAULT_UPDATE_INTERVAL
        );
    }
    private updater() {
        let nC = ConsoleIO.loadCommands();

        if (!equal(this.commands, nC)) {
            this.commands = nC;
            console.log('updated command.');
        }
    }
    private static loadCommands(): ICommand[] {
        let result: ICommand[] = [];
        let folder = path.join(
            process.cwd(),
            './dev/system/ConsoleIO/commands/'
        );
        let x = fs.readdirSync(folder);
        x = x.filter((f: string) => f.endsWith('.ts'));
        for (const key in x) {
            const element = x[key];
            let el = require(path.join(folder, element));
            let c: ICommand = {
                name: element,
                regex: ConsoleIO.RegExpParser(new el.default().regex),
            };
            result.push(c);
        }
        return result;
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
            let com = require(`./commands/${command}`);
            let comJS: Command<any> = new com.default();
            comJS.on('done', () => {
                console.log(`executed command '${command}'`);
            });
            comJS.run(params, optional).then(obj => {
                // console.log(obj);
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
            let starter = 1;
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
                            typer = '(["])((?:.)*?)\\1';
                            starter = 2;
                            break;
                        case 'json':
                            typer = '\\{.*\\}';
                            break;
                        default:
                            break;
                    }
                    stringAdd = `${isOptional ? '(?:' : ''}(${
                        type === 'text' ? '?:' : ''
                    }${typer})${type === 'text' ? '+' : ''}${length}${
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
            result = { start: starter, exp: new RegExp(res, 'gi') };
        }

        return result;
    }
}

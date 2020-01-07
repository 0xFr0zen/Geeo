import Command from './index';
export default class EXITER extends Command<any> {
    regex = 'exit';
    async run(lol: any, filter?: any): Promise<any> {
        process.exit(0);
    }
}

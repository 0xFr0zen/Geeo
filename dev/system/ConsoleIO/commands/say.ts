import Command from './index';
export default class Say_Text extends Command<any> {
    regex = 'say <text>';
    async run(message: any, optionals?: any[]): Promise<any> {
        await super.run(message, optionals);
        return new Promise((resolve, reject) => {
            console.log(message);
            this.emit('done');
            resolve({ message: message });
        });
    }
}

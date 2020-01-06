import Command from './index';
export default class Say_Text extends Command<any> {
    regex = 'say <text>';
    run(message: any, optionals?: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(message);
            resolve({ message: message });
        });
    }
}

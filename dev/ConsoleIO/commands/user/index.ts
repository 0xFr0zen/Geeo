import Command from '../index';
export default class USER extends Command<any> {
    run(task: any, filter?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let result: boolean = false;
            let error:Error = new Error("This Command does not exist.");
            console.log(task, filter);
            result = true;
            this.emit('done');
            result ? resolve({done:true}) : reject({error:error});
        });
    }
}

import Command from '../index';
import Entity from '../../../Entity/index';
export default class GUI extends Command<any> {
    run(name: any, filter?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let error: Error = new Error("Entites could be processed.");
            console.log(name);
            let ename = Entity.getEntities().find((e:string)=>{return e === name});
            let ent = Entity.getEntity(ename);
            console.log(ent);
            resolve({entity:ent});
        });
    }
}

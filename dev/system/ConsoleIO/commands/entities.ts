import Command from './index';
import Entity from '../../Entity/index';
export default class GUI extends Command<any> {
    regex = 'entities <any> <text>';
    async run(name: any, filter?: any): Promise<any> {
        await super.run(name, filter);
        return new Promise((resolve, reject) => {
            let error: Error = new Error('Entites could be processed.');
            console.log(name);
            let ename = Entity.getEntities().find((e: string) => {
                return e === name;
            });
            let ent = Entity.getEntity(ename);
            console.log(ent);
            resolve({ entity: ent });
        });
    }
}

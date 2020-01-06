import Command from './index';
export default class UPDATE extends Command<any> {
    regex = 'update <any>';
    async run(version: any, filter?: any[]): Promise<any> {
        await super.run(version, filter);
        return new Promise((resolve, reject) => {
            let updated = false;
            let error: Error = null;
            updated = true;
            updated ? resolve({ version: version }) : reject({ error: error });
        });
    }
}

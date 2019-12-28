import Entity from '..';
import * as fs from 'fs';
import * as path from 'path';
import { GeeoMap } from '../../GeeoMap';
import Node from '../../Crypt';
import Identity from '../../Identity/index';

export enum StorageType {
    Inventory = 'inventory',
    Documents = 'documents',
}
/**
 * Unit Class
 *
 * @export
 * @class Safe
 * @extends {Entity}
 */
export default class Safe extends Entity {
    /**
     * Creates an instance of Unit.
     *
     * @param {string} name Name of storage.
     * @memberof Safe
     */
    constructor(
        username: string,
        name: string,
        storagetype: StorageType = StorageType.Inventory,
        standalone = false
    ) {
        super('safe', name);
        let p = path.join(
            process.cwd(),
            './saved/entities/users/',
            Buffer.from(username, 'utf8').toString('hex'),
            'safes'
        );
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
        this.addParameter('user', username);
        this.addParameter('storagetype', storagetype);
        this.addParameter('space', new GeeoMap<string, any>());
        if(!standalone){
            this.save();
        }else {
        }
    }
    public static from(json: any): Safe {
        // console.log("SAFE JSON", json);
        
        json = json.safe;
        let safe: Safe = new Safe(json.user, json.name, json.storagetype, true);

        let keys = Object.keys(json);

        keys.forEach(key => {
            safe.addParameter(key, json[key]);
        });
        safe.update('last_loaded', Date.now());
        return safe;
    }
    public getSpace(): GeeoMap<string, any> {
        let result = null;
        let s = this.getParameter('space');
        let gm: GeeoMap<string, any> = new GeeoMap<string, any>();
        gm.fromJSON(JSON.parse(JSON.stringify(s)));
        result = gm;
        return result;
    }
    public addItem(name: string, item: any): Safe {
        this.update('space', this.getSpace().addItem(name, item));
        return this;
    }
    public getItem(name: string): Object {
        return this.getSpace().getItem(name);
    }
    public removeItem(name: string): Safe {
        let space = this.getSpace();
        space.removeItem(name);
        this.update('space', space);
        return this;
    }
    public getPath(): string {
        let result = this.hasParameter('path')
            ? this.getParameter('path').toString()
            : null;
        return result;
    }
    public getUsername():string {
        return this.getParameter('user').toString()
    }
}

import Entity from '../Entity';
import * as fs from 'fs';
import * as path from 'path';
import { GeeoMap } from '../GeeoMap';

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
        name: string,
        storagetype: StorageType = StorageType.Inventory
    ) {
        super('safe', name);
        this.addParameter('storagetype', storagetype);
        this.addParameter('space', new GeeoMap<string, any>());
    }
    public static from(json:any): Safe {
        json = json.safe;
        let safe:Safe = new Safe(json.name);
        
        let keys = Object.keys(json)

        keys.forEach(key => {
            safe.addParameter(key, json[key]);
        });
        safe.update('last_loaded', Date.now());
        return safe;
    }
    public getSpace(): GeeoMap<string, any> {
        let result = null;
        let s = this.getParameter('space');
        let gm:GeeoMap<string,any> = new GeeoMap<string,any>();
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

}

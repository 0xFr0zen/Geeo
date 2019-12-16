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
 * @class Storage
 * @extends {Entity}
 */
export default class Safe extends Entity {
    /**
     * Creates an instance of Unit.
     *
     * @param {string} name Name of storage.
     * @memberof Storage
     */
    constructor(
        name: string,
        storagetype: StorageType = StorageType.Inventory
    ) {
        super('safe', name);
        this.addParameter('storagetype', storagetype);
        this.addParameter('space', new GeeoMap<string, any>());
    }
    public getSpace(): GeeoMap<string, any> {
        let result = null;
        let s = this.getParameter('space');
        if (s instanceof GeeoMap) {
            result = s;
        }
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
    /**
     * Saves whole storageunit (true => or all inventories)
     *
     * @returns {boolean} success of the action.
     * @memberof Storage
     */
    public save(): boolean {
        let result = true;
        let s = this.toString();
        fs.writeFileSync(
            path.join(
                path.dirname(require.main.filename),
                `${this.getName()}.json`
            ),
            s
        );

        return result;
    }
}

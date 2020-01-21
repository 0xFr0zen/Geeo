import Entity from '../../Entity/';
import * as fs from 'fs';
import * as path from 'path';
import { GeeoMap } from '../../../system/GeeoMap';
import { resolve } from 'dns';
import Database from '../../../Database/index';
import Queries from '../../../Database/Queries';

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
        storagetype: StorageType = StorageType.Inventory
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
    }
    public static load(username: string): Promise<Safe[]> {
        return new Promise((resolve, reject) => {
            let results: Safe[] = [];
            let db = new Database();
            db.query(Queries.STORAGE.LOAD, [username])
                .then(res => {
                    if (res.length > 0) {
                        res.forEach(r => {
                            let safe = new Safe(
                                r.getRow('username'),
                                r.getRow('safename'),
                                r.getRow('safetype')
                            );
                            results.push(safe);
                        });
                    } else {
                        reject('No Safe found.');
                    }
                })
                .catch(e => {
                    return reject(e);
                });
            return resolve(results);
        });
    }
    public static from(json: any): Safe {
        json = json.safe;
        let safe: Safe = new Safe(json.user, json.name, json.storagetype);

        let keys = Object.keys(json);

        keys.forEach(key => {
            safe.addParameter(key, json[key]);
        });
        safe.updateParameter('last_loaded', Date.now());
        return safe;
    }
    public getSpace(): Promise<GeeoMap<string, any>> {
        return new Promise((resolve, reject) => {
            let result = null;
            let s = this.getParameter('space');
            let gm: GeeoMap<string, any> = new GeeoMap<string, any>();
            gm.fromJSON(JSON.parse(JSON.stringify(s)));
            result = gm;
            resolve(result);
        });
    }
    public async addItem(name: string, item: any): Promise<Safe> {
        return new Promise(async (resolve, reject) => {
            this.updateParameter(
                'space',
                (await this.getSpace()).addItem(name, item)
            );
            resolve(this);
        });
    }
    public async getItem(name: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let space = await this.getSpace();
            if (space == null) {
                reject('No Space created.');
            }
            resolve(space.getItem(name));
        });
    }
    public async removeItem(name: string): Promise<Safe> {
        return new Promise(async (resolve, reject) => {
            let space = await this.getSpace();
            if (space == null) {
                reject('No Space created.');
            }

            space.removeItem(name);
            if (await !this.updateParameter('space', space)) {
                reject(`Couldn't update '${name}'`);
            }
            resolve(this);
        });
    }
    public getPath(): string {
        let result = this.hasParameter('path')
            ? this.getParameter('path').toString()
            : null;
        return result;
    }
    public getUsername(): string {
        return this.getParameter('user').toString();
    }
}
export namespace Safes {
    export function listof(username: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            let db = new Database();
            db.query(Queries.STORAGE.LOAD, [username])
                .then(resultlist => {
                    let list: string[] = [];
                    for (const key in resultlist) {
                        let s = resultlist[key];
                        list.push(s.getRow('safeid'));
                    }
                    console.log('done did it yaaay', list);
                    
                    resolve(list);
                    db.close();
                })
                .catch(e => {
                    console.log('safes error', e);

                    reject(e);
                    db.close();
                });
        });
    }
}

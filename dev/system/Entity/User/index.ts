import Entity from '..';
import * as fs from 'fs';
import * as path from 'path';
import Safe, { StorageType } from '../Safe';
import Node from '../../../Crypt';
import Database from '../../../Database/index';
import Queries from '../../../Database/Queries';

/**
 * User Class.
 *
 * @export
 * @class User
 * @extends {Entity}
 */
export class User extends Entity {
    /**
     * Creates an instance of User.
     * @param {string} name
     * @memberof User
     */
    constructor(name: string) {
        super('user', name);
        this.addParameter('settings', '');
        this.addParameter('storages', []);
        this.addParameter('loggedin', false);
    }
    public static find(uname: string, DB: Database): Promise<User> {
        return new Promise((resolve, reject) => {
            if (DB == null) {
                reject('No Database');
            }
            DB.query(Queries.USER.FIND_EXACT, [uname])
                .then(results => {
                    console.log(results);

                    if (results.length == 0) {
                        return reject(`No User '${uname}' found`);
                    }
                    let userres = results[0];
                    console.log(userres);
                    
                    let userCols = userres.getColumns();
                    
                    let user = new User(userres.getRow('username'));
                    for (let k in userCols) {
                        let param = userCols[k];
                        let val = userres.getRow(param);
                        user.updateParameter(param, val);
                    }
                    console.log(user);
                    
                    return resolve(user);
                })
                .catch(e => {
                    if(e === 'No result'){
                        return reject(`No User '${uname}' found`);
                    }else {
                        return reject(e);
                    }
                });
        });
    }
    /**
     * Checks if the user Exists
     *
     * @static
     * @param {(string | Identity)} name
     * @returns {boolean}
     * @memberof User
     */
    public static exists(name: string): boolean {
        let p1 = process.cwd();
        let p = path.join(
            p1,
            './saved/entities/users/',
            Buffer.from(name, 'utf8').toString('hex')
        );
        return fs.existsSync(p);
    }

    /**
     * Creates a User based on name
     *
     * @static
     * @param {string} name
     * @returns {User}
     * @memberof User
     */
    public static create(name: string): User {
        let user = null;
        return user;
    }
    public setLoggedIn(s: boolean) {
        this.addParameter('loggedin', s);
    }
    public isLoggedIn(): boolean {
        let o = this.getParameter('loggedin');
        let result: boolean = false;
        if (typeof o === 'boolean') {
            result = o;
        }

        return result;
    }
    /**
     * Creates a storage for the User.
     *
     * @private
     * @memberof User
     */
    public addSafe(storage: Safe | string): boolean {
        let result = false;

        if (this.hasParameter('storages')) {
            let storages = this.getParameter('storages');
            if (storages != null && Array.isArray(storages)) {
                if (storage instanceof Safe) {
                    if (storages.length < storages.push(storage)) {
                        this.updateParameter('storages', storages);
                        result = true;
                    }
                } else {
                    let s = new Safe(
                        this.getName(),
                        storage,
                        StorageType.Inventory
                    );
                    if (storages.length < storages.push(s)) {
                        this.updateParameter('storages', storages);
                        result = true;
                    }
                }
            }
        }
        return result;
    }
    public getSafe(name: string): Safe {
        let result = null;
        if (this.hasParameter('storages')) {
            let storages = this.getParameter('storages');
            if (storages != null && Array.isArray(storages)) {
                result = storages.filter((storage: Safe) => {
                    return storage.getName() === name;
                })[0];
            }
        }
        return result;
    }
    public removeSafe(name: string): boolean {
        let result = false;
        if (this.hasParameter('storages')) {
            let storages = this.getParameter('storages');
            if (storages != null && Array.isArray(storages)) {
                let safe = null;
                safe = storages.filter((storage: Safe) => {
                    return storage.getName() === name;
                })[0];
                if (safe != null) {
                    storages = storages.splice(storages.indexOf(safe), 1);
                    this.updateParameter('storages', storages);
                    result = true;
                }
            }
        }
        return result;
    }
    public getSafes(): Safe[] {
        let result = null;
        if (this.hasParameter('storages')) {
            let storages = this.getParameter('storages');
            if (storages != null && Array.isArray(storages)) {
                result = storages;
            }
        }
        return result;
    }
}

export default User;

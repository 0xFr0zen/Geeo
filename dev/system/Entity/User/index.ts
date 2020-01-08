import Entity from '..';
import * as fs from 'fs';
import * as path from 'path';
import Safe, { StorageType } from '../Safe';
import Node from '../../../Crypt';
import Database from '../../../Database/index';

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
    public static find(name: string, DB: Database): Promise<User> {
        return new Promise((resolve, reject)=> {
            if(DB == null){
                reject("No Database");
            }
            DB.query(`SELECT username, firstname, lastname, email, created FROM users WHERE username = ?`, [name]).then(results => {
                console.log(results);
            
                if(results.length == 0){
                    reject(`No User '${name}' found`);
                }
                let user = new User("");
                let userres = results[0];
                let userCols = userres.getColumns();
                for(let k in userCols){
                    let param = userCols[k];
                    let val = userres.getRow(param);
                    user.updateParameter(param, val);
                }
                resolve(user);
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

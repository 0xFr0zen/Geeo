import Entity, { EntityFilter } from '..';
import * as fs from 'fs';
import * as path from 'path';
import Safe, { StorageType } from '../Safe';
import Node from '../../../Crypt';
import Database from '../../../Database/index';
import Queries from '../../../Database/Queries';
import Options from '../../../Database/Options';
import Inventories from '../../Inventory';
export interface UserFilter extends EntityFilter {
    username?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
}
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
        this.addParameter('loggedin', false);
        if (User.exists(name)) {
            this.loadSafes();
        }
    }
    public static async exists(name: string): Promise<boolean> {
        let u = await User.findFirst({ username: name });
        return u != null;
    }
    public static find(filter: UserFilter): Promise<User[]> {
        return new Promise(async (resolve, reject) => {
            let db = new Database();
            let filtered_values = await db.format(filter);

            db.query(Queries.USER.FIND_MULTIPLE.replace('?', filtered_values))
                .then((results) => {
                    if (results.length == 0) {
                        return reject(`No User via '${filter}' found`);
                    }
                    let ret: User[] = [];
                    for (let u in results) {
                        let userres = results[u];

                        let userCols = userres.getColumns();

                        let user = new User(userres.getRow('username'));

                        for (let k in userCols) {
                            let param = userCols[k];
                            let val = userres.getRow(param);
                            user.updateParameter(param, val);
                            ret.push(user);
                        }
                    }
                    return resolve(ret);
                })
                .catch((e) => {
                    if (e === 'No result') {
                        return reject(`No User via '${filter}' found`);
                    } else {
                        return reject(e);
                    }
                });
        });
    }
    public static findFirst(filter: UserFilter): Promise<User> {
        return new Promise(async (resolve, reject) => {
            let users = await User.find(filter);
            return resolve(users[0]);
        });
    }
    /**
     * Creates a User based on name
     *
     * @static
     * @param {string} name
     * @returns {User}
     * @memberof User
     */
    public static create(
        name: string,
        password: string,
        options: Options.UserCreateOptions
    ): Promise<User> {
        return new Promise(async (resolve, reject) => {
            let db = new Database();
            let results = await db.query(Queries.USER.CREATE, [
                name,
                password,
                options.firstname,
                options.lastname,
                options.email,
                options.created,
            ]);
            console.log(results);
        });
    }
    public static demo(): User {
        return new DemoUser();
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

    private async loadSafes() {
        this.addParameter('storages', await Safe.load(this.getName()));
    }
    /**
     * Creates a storage for the User.
     *
     * @private
     * @memberof User
     */
    public addSafe(storage: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (this.hasParameter('storages')) {
                let storages = this.getParameter('storages');
                if (storages != null && Array.isArray(storages)) {
                    let s = new Safe(
                        this.getName(),
                        storage,
                        StorageType.Inventory
                    );
                    if (storages.length < storages.push(s)) {
                        return resolve(
                            this.updateParameter('storages', storages)
                        );
                    } else {
                        return resolve(false);
                    }
                }
            }
        });
    }
    public getSafe(name: string): Promise<Safe> {
        return new Promise((resolve, reject) => {
            let result: Safe = null;
            if (this.hasParameter('storages')) {
                let storages = this.getParameter('storages');
                if (storages != null && Array.isArray(storages)) {
                    result = storages.filter((storage: Safe) => {
                        return storage.getName() === name;
                    })[0];
                }
            }
            if (result != null) {
                return resolve(result);
            } else {
                return reject('No Safe found');
            }
        });
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
        let result: Safe[] = [];
        if (this.hasParameter('storages')) {
            let storages = this.getParameter('storages');
            if (storages != null && Array.isArray(storages)) {
                result = storages;
            }
        }
        return result;
    }
}
class DemoUser extends User {
    public demoSafe: Safe = null;
    constructor() {
        super('demouser');
        this.demoSafe = new Safe(
            this.getName(),
            'demosafe',
            StorageType.Inventory,
            true
        );
        this.demoSafe.addItem('demoitem', 'demoItem_test_1');
        this.demoSafe.addItem('demoitem', 'demoItem_test_2');
        this.demoSafe.addItem('demoitem', 'demoItem_test_3');
    }
}
export default User;

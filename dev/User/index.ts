import Entity from '../Entity';
import * as fs from 'fs';
import * as path from 'path';
import Safe from '../Safe';
import Node from '../Crypt';

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
        this.addSafe(new Safe('documents'));
    }
    public static from(name: string | JSON): User {
        let u: User = null;
        if (typeof name === 'string') {
            let p = path.join(
                path.dirname(require.main.filename),
                '../saved/users/',
                name.concat('.geeocypher')
            );
            let file = fs.readFileSync(p).toString();

            let encJSON = Node.from(JSON.parse(file));

            let userJSON = JSON.parse(JSON.parse(encJSON.toString()).data).user;
            u = new User(name);
            let keys = Object.keys(userJSON);

            keys.forEach(key => {
                u.addParameter(key, userJSON[key]);
            });
            u.update('last_loaded', Date.now());
        } else {
            console.log('');
        }
        return u;
    }
    /**
     * Creates a storage for the User.
     *
     * @private
     * @memberof User
     */
    public addSafe(storage: Safe): boolean {
        let result = false;
        let storages = this.getParameter('storages');
        if (storages != null && Array.isArray(storages)) {
            if (storages.length < storages.push(storage)) {
                this.update('storages', storages);
                result = true;
            }
        }
        return result;
    }
    public getSafe(name: string): Safe {
        let result = null;
        let storages = this.getParameter('storages');
        if (storages != null && Array.isArray(storages)) {
            result = storages.filter((storage: Safe) => {
                return storage.getName() === name;
            })[0];
        }

        return result;
    }
    public getSafes(): Array<Safe> {
        let result = null;
        let storages = this.getParameter('storages');
        if (storages != null && Array.isArray(storages)) {
            result = storages;
        }

        return result;
    }
    /**
     * Stores the User to a file in root folder.
     *
     * @returns {boolean} Success of saved state.
     * @memberof User
     */
    public save(): boolean {
        let me = this;
        let result: boolean = false;
        let node = this.getParameter('node');
        let json = JSON.parse(JSON.stringify(node));
        let data = json.priv;
        let key = json.key;
        let iv = json.iv;
        fs.writeFileSync(
            path.join(
                path.dirname(require.main.filename),
                '../saved/users/',
                this.getName().concat('.geeocypher')
            ),
            (() => {
                result = true;
                let obj = { key: key, iv: iv, data: data };
                return JSON.stringify(obj);
            })()
        );
        return result;
    }
}

export default User;

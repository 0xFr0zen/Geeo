import Entity from '../Entity';
import * as fs from 'fs';
import * as path from 'path';
import Safe from '../Safe';
import Node from '../Crypt';
import Identity from '../Identity/index';

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
        this.addParameter('identity', Identity.of(name));
        this.addSafe(new Safe(name, 'documents'));
        this.save();
    }

    /**
     * Checks if the user Exists
     *
     * @static
     * @param {(string | Identity)} name
     * @returns {boolean}
     * @memberof User
     */
    public static exists(name: string | Identity): boolean {
        let p1 = path.dirname(require.main.filename);
        if (name instanceof Identity) {
            let p = path.join(
                p1,
                '../saved/entities/users/',
                name.getPublicKey()
            );
            return fs.existsSync(p);
        } else {
            let p = path.join(
                p1,
                '../saved/entities/users/',
                Buffer.from(name, 'utf8').toString('hex')
            );
            return fs.existsSync(p);
        }
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
        let p = path.join(
            path.dirname(require.main.filename),
            '../saved/entities/users/',
            Buffer.from(name, 'utf8').toString('hex')
        );
        let user = null;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
            user = new User(name);
        } else {
            console.error(`User ${name} already exists.`);
        }
        return user;
    }

    /**
     *
     * Loads User based on hash
     * @static
     * @param {string} hash
     * @returns {User}
     * @memberof User
     */
    public static from(hash: string): User {
        let u: User = null;
        let p = path.join(
            path.dirname(require.main.filename),
            '../saved/entities/users/',
            hash,
            'latest'
        );
        let p2 = path.join(
            path.dirname(require.main.filename),
            '../saved/entities/users/',
            hash,
            'user'
        );
        let name = '';
        let file = fs.readFileSync(p).toString();

        let encJSON = new Node(file, {
            publicKey: Buffer.from(hash, 'hex'),
            privateKey: Buffer.from(
                JSON.parse(fs.readFileSync(p2).toString()).private,
                'hex'
            ),
        });

        let userJSON = JSON.parse(JSON.parse(encJSON.decryptText()).data).user;
        u = new User(userJSON.name);
        let keys = Object.keys(userJSON);

        keys.forEach(key => {
            u.addParameter(key, userJSON[key]);
        });
        u.addParameter('last_loaded', Date.now());
        return u;
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

        fs.writeFileSync(
            path.join(
                path.dirname(require.main.filename),
                '../saved/entities/users/',
                Buffer.from(this.getName(), 'utf8').toString('hex'),
                'latest'
            ),
            (() => {
                result = true;
                return this.toString();
            })()
        );
        return result;
    }
}

export default User;

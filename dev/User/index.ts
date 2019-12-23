import Entity from '../Entity';
import * as fs from 'fs';
import * as path from 'path';
import Safe from '../Entity/Safe';
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
                name.getPublicKey().toString('hex')
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
    public static from(ident: Identity): User {
        let u: User = null;
        let userpathname = ident.getPublicKey().toString('hex');
        let p3 = path.join(
            path.dirname(require.main.filename),
            '../saved/entities/users/',
            userpathname
        );
        let p = path.join(p3, 'latest');
        let p2 = path.join(p3, 'user');
        let name = '';
        if (fs.existsSync(p)) {
            let file = fs.readFileSync(p).toString();
            let encJSON = new Node(file, {
                publicKey: ident.getPublicKey(),
                privateKey: ident.getPrivateKey(),
            });
            let userJSON = JSON.parse(JSON.parse(encJSON.decryptText()).data)
                .user;
            u = new User(userJSON.name);
            let keys = Object.keys(userJSON);
            keys.forEach(key => {
                u.addParameter(key, userJSON[key]);
            });
            u.addParameter('last_loaded', Date.now());
        } else {
            u = new User(ident.getPublicKey().toString('utf8'));
        }

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
        let currentTimestamp: string = Date.now().toString();
        let me = this;
        let result: boolean = false;
        let comparison: Object = {};
        let snaps = path.join(
            path.dirname(require.main.filename),
            '../saved/entities/users/',
            Buffer.from(this.getName(), 'utf8').toString('hex'),
            'snapshots/'
        );
        let currentSnapPath: string = path.join(snaps, currentTimestamp);
        let snapsFiles = fs.readdirSync(snaps).sort();
        let userJSON = null;
        let latestSnap = null;
        if (snapsFiles.length > 0) {
            latestSnap = path.join(snaps, snapsFiles[snapsFiles.length - 1]);
            userJSON = JSON.parse(fs.readFileSync(latestSnap).toString());
        } else {
            latestSnap = currentSnapPath;
            userJSON = {};
        }
        comparison = this.compare(userJSON);
        let i = this.getParameter('identity');
        if (i instanceof Identity) {
            let pk = Buffer.from(i.getPrivateKey().toString('hex'), 'hex');
            let puk = i.getPublicKey();

            fs.writeFileSync(
                latestSnap,
                (() => {
                    result = true;
                    return new Node(JSON.stringify(comparison), {
                        privateKey: pk,
                        publicKey: puk,
                    }).encryptText();
                })()
            );
        }

        return result;
    }
}

export default User;

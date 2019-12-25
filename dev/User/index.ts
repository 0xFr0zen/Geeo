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
    constructor(name: string, standalone = false) {
        super('user', name);
        if (!standalone) {
            this.addParameter('settings', '');
            this.addParameter('storages', []);
            this.addParameter('loggedin', false);
            this.addParameter('identity', Identity.of(name));
            this.addSafe(new Safe(name, 'documents'));
            this.save();
        } else {
            this.addParameter('settings', '');
            this.addParameter('storages', []);
        }
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
    private static standalone(): Entity {
        let u = new User('standalone', true);
        return u;
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
        let userpathname = Buffer.from(ident.getUsername(), 'utf8').toString(
            'hex'
        );

        let p3 = path.join(
            path.dirname(require.main.filename),
            '../saved/entities/users/',
            userpathname
        );
        let p = path.join(p3, 'snapshots/');
        let snaps = fs.readdirSync(p).sort();
        if (snaps.length > 0) {
            let latest = snaps[snaps.length - 1];
            let latestPath = path.join(p, latest);
            let p2 = path.join(p3, 'user');
            let name = '';
            let file = fs.readFileSync(latestPath).toString();
            let encJSON = new Node(file, {
                publicKey: ident.getPublicKey(),
                privateKey: ident.getPrivateKey(),
            });
            let decryptedData = encJSON.decryptText();

            let userJSON = JSON.parse(decryptedData).user;
            u = new User(userJSON.name, true);
            let keys = Object.keys(userJSON);
            keys.forEach(key => {
                u.addParameter(key, userJSON[key]);
            });
            u.addParameter('last_loaded', Date.now());
        } else {
            u = new User(ident.getUsername());
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
            userJSON = JSON.parse(User.standalone().toString());
        }
        comparison = this.compare(userJSON);
        console.log(comparison);

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

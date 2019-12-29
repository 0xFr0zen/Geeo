import Entity from '..';
import * as fs from 'fs';
import * as path from 'path';
import Safe from '../Safe';
import Node from '../../Crypt';
import Identity from '../../Identity/index';

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
        this.addParameter('settings', '');
        this.addParameter('storages', []);
        this.addParameter('loggedin', false);
        if (!standalone) {
            this.addParameter('identity', Identity.of(name));
            this.addSafe(new Safe(name,'default'));
            this.save();
        } else {
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
        let p1 = process.cwd();
        if (name instanceof Identity) {
            let p = path.join(
                p1,
                './saved/entities/users/',
                Buffer.from(name.getUsername(), 'utf8').toString('hex')
            );
            return fs.existsSync(p);
        } else {
            let p = path.join(
                p1,
                './saved/entities/users/',
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
            process.cwd(),
            './saved/entities/users/',
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
        if (ident != null) {
            let userpathname = Buffer.from(
                ident.getUsername(),
                'utf8'
            ).toString('hex');

            let userPath = path.join(
                process.cwd(),
                './saved/entities/users/',
                userpathname
            );
            let p = path.join(userPath, 'snapshots/');
            let snaps = fs.readdirSync(p).sort();
            if (snaps.length > 0) {
                let latest = snaps[snaps.length - 1];
                let latestPath = path.join(p, latest);
                let p2 = path.join(userPath, 'user');
                let name = '';
                let file = fs.readFileSync(latestPath).toString();
                let encJSON = new Node(file, {
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
            let safesnap = path.join(userPath, 'safes');
            let safes = fs.readdirSync(safesnap);
            for (const safestring in safes) {
                let safename = safes[safestring];
                let safesnapspath  =path.join(safesnap, safename, "./snapshots/");
                let safessnaps = fs
                    .readdirSync(safesnapspath)
                    .sort();
                    
                // console.log(safessnaps);
                if (safessnaps.length > 0) {
                    let latest = safessnaps[safessnaps.length - 1];
                    let latestPath = path.join(safesnapspath, latest);

                    let file = fs.readFileSync(latestPath).toString();
                    let encJSON = new Node(file, {
                        privateKey: ident.getPrivateKey(),
                    });
                    let decryptedData = encJSON.decryptText();
                    let safe = Safe.from(JSON.parse(decryptedData));
                    u.addSafe(safe);
                }
            }
        } else {
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
        if (this.hasParameter('storages')) {
            let storages = this.getParameter('storages');
            if (storages != null && Array.isArray(storages)) {
                if (storages.length < storages.push(storage)) {
                    this.update('storages', storages);
                    result = true;
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
                    this.update('storages', storages);
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
                console.log(storages);
                
                result = storages;
            }
        }
        return result;
    }
}

export default User;

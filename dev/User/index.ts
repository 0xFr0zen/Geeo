import Entity from '../Entity';
import * as fs from 'fs';
import * as path from 'path';
import Safe from '../Safe';

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
        this.addSafe(new Safe("documents"));


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
            result = storages.filter((storage : Safe) => {
                return storage.getName() === name;
            })[0];
        }

        return result;
    }
    /**
     * Shows the User in JSON-Format
     *
     * @returns {string} JSON-string text.
     * @memberof User
     */
    public inspect(): string {
        return this.toString();
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
                this.getName().concat('.json')
            ),
            (() => {
                result = true;
                return me.toString();
            })()
        );
        return result;
    }
}

export default User;

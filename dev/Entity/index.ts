import { TSMap } from 'typescript-map';
import Node from '../Crypt';
import { GeeoMap } from '../GeeoMap';

/**
 *Entity Class
 *
 * @export
 * @class Entity
 */
export default class Entity {
    /**
     * All the properties are stored here.
     *
     * @private
     * @type {GeeoMap<string, Object>}
     * @memberof Entity
     */
    private parameters: GeeoMap<string, Object> = new GeeoMap<string, Object>();
    /**
     *Creates an instance of Entity.
     * @param {string} type "type" of Entity
     * @param {string} name Name of Entity
     * @memberof Entity
     */
    constructor(type: string, name: string) {
        this.addParameter('type', type);
        this.addParameter('name', name.toString());
        this.addParameter('created', Date.now());
        this.addParameter('node', new Node(this.toString()));
        this.addParameter('last_saved', null);
        this.addParameter('last_loaded', Date.now());
        this.addParameter('updated', []);
        this.addParameter('removed', null);
    }

    /**
     *Returns the name of Entity.
     *
     * @returns {string} Name of Entity.
     * @memberof Entity
     */
    public getName(): string {
        let name = this.getParameter('name');
        return name.toString();
    }

    /**
     *Returns type of Entity.
     *
     * @returns {string} Type of Entity.
     * @memberof Entity
     */
    public getType(): string {
        let type = this.getParameter('type');
        return type.toString();
    }
    /**
     * Returns Created Date.
     *
     * @returns {string} Type of Entity.
     * @memberof Entity
     */
    public getCreated(): Date {
        let date = this.getParameter('created');
        return new Date(Number.parseInt(date.toString()));
    }

    /**
     *  Returns last saved date
     *
     * @returns {Date}
     * @memberof Entity
     */
    public getLastSaved(): Date {
        let date = this.getParameter('last_saved');
        return new Date(Number.parseInt(date.toString()));
    }
    /**
     * Returns last loaded date
     *
     * @returns {Date}
     * @memberof Entity
     */
    public getLastLoaded(): Date {
        let date = this.getParameter('last_saved');
        return new Date(Number.parseInt(date.toString()));
    }
    /**
     * Returns last loaded date
     *
     * @returns {Date}
     * @memberof Entity
     */
    public getUpdated(): Date[] {
        let dates = this.getParameter('updated');
        let result:Date[] = [];
        if (Array.isArray(dates)) {
            result = dates;
        }
        return result;
    }
    /**
     * Returns removedDate
     *
     * @returns {Date}
     * @memberof Entity
     */
    public getRemoved(): Entity[] {
        let removed = this.getParameter('removed');
        let result = [];
        if(Array.isArray(removed)){
            result = removed;
        }
        return result;
    }
    /**
     * Return Node of Entity.
     *
     * @returns {GeeoCrypt.Node} Node of Entity.
     * @memberof Entity
     */
    public getNode(): Node {
        let result = null;
        let x = this.getParameter('node');
        let json = JSON.parse(JSON.stringify(x));
        
        result = Node.from({data:json.priv,key:json.key, iv:json.iv});
        return result;
    }

    /**
     * Returns properties of Entity.
     *
     * @returns {GeeoMap<string, Object>}
     * @memberof Entity
     */
    public getParameters(): GeeoMap<string, Object> {
        return this.parameters;
    }

    /**
     * Returns one properties by its given name.
     *
     * @protected
     * @param {string} key Name of property.
     * @returns {Object} property value.
     * @memberof Entity
     */
    protected getParameter(key: string): Object {
        return this.parameters.hasItem(key)
            ? this.parameters.getItem(key)
            : null;
    }

    /**
     * Adds new property by its name or updates the given property.
     *
     * @protected
     * @param {string} key Name of property.
     * @param {Object} obj Value of property.
     * @memberof Entity
     */
    protected addParameter(key: string, obj: Object): void {
        if (this.parameters.hasItem(key)) {
            this.update(key, obj);
        } else {
            this.parameters = this.parameters.addItem(key, obj);
        }
    }

    /**
     * Checks if given property exists or not.
     *
     * @protected
     * @param {string} key Name of property.
     * @returns {boolean} success(true) if exists.
     * @memberof Entity
     */
    protected hasParameter(key: string): boolean {
        return this.parameters.hasItem(key);
    }

    /**
     * Removes property of Entity.
     *
     * @protected
     * @param {string} key Name of property.
     * @memberof Entity
     */
    protected removeParameter(key: string): void {
        this.parameters.removeItem(key);
    }

    /**
     *  Updates property by its name and value.
     *
     * @protected
     * @param {string} key Name of property.
     * @param {Object} value Value of property.
     * @memberof Entity
     */
    protected update(key: string, value: Object): void {
        this.parameters = this.parameters.addItem(key, value);
        let old: any = this.getParameter('updated');
        if (key !== 'node') {
            this.parameters = this.parameters.addItem(
                'node',
                new Node(this.toString())
            );
        }

        if (Array.isArray(old)) {
            old.push(Date.now());
            this.parameters = this.parameters.addItem('updated', old);
        }
    }

    /**
     * Grants Access of someone to the Entity.
     *
     * @param {string} username Username to add.
     * @memberof Entity
     */
    protected grantAccess(username: string) {
        let o = this.getAccessList();
        let access: Array<string> = [];
        if (Array.isArray(o)) {
            access = o;
        }
        access.push(username);

        this.update('access', access);
    }

    /**
     * Revokes Access of someone to the Entity.
     *
     * @param {string} username Username to be revoked.
     * @memberof Entity
     */
    protected revokeAccess(username: string) {
        let o = this.getAccessList();
        let access: Array<string> = [];
        if (Array.isArray(o)) {
            access = o;
        }
        access = access.filter(name => {
            return name !== username;
        });

        this.update('access', access);
    }

    /**
     * Returns a list of users having access to the Entity.
     *
     * @returns {string[]} List of users.
     * @memberof Entity
     */
    protected getAccessList(): string[] {
        let o = this.getParameter('access');
        let access: Array<string> = [];
        if (Array.isArray(o)) {
            access = o;
        }
        return access;
    }

    /**
     * Returns a readable version of the current state.
     *
     * @returns {string} Readable current state.
     * @memberof Entity
     */
    public toString(): string {
        let packager = new Package();
        return packager.wrap(this).toString();
    }
}

/**
 *
 *
 * @class Package
 */
export class Package {
    /**
     *
     *
     * @param {GeeoMap<string, Object>} gm
     * @returns {Object}
     * @memberof Package
     */
    public geeomapWrap(gm: GeeoMap<any, any>): string {
        let result = '';
        let me = this;
        let keys = gm.keys();

        if (keys.length > 0) {
            keys.forEach(key => {
                let value = gm.get(key);
                let re = `"${key}":`;
                if (value === null) {
                    re += 'null';
                } else {
                    if (value instanceof GeeoMap) {
                        if (value.length > 0) {
                            re += me.geeomapWrap(value);
                        } else {
                            re += '{}';
                        }
                    } else if (value instanceof Entity) {
                        let json = this.wrap(value);
                        if (json === '{}') {
                            re += '{}';
                        } else {
                            let m = json.substring(1, json.length - 1);
                            re += m;
                        }
                    } else {
                        let wrappedCorrect = me.otherWrap(value);
                        re += wrappedCorrect;
                    }
                }
                result += re.concat(',');
            });

            result = '{'.concat(
                result.substr(0, result.length - 1).concat('}')
            );
        } else {
            result = '{}';
        }
        return result;
    }

    /**
     *
     *
     * @private
     * @param {string} re
     * @param {*} value
     * @returns {string}
     * @memberof Package
     */
    private otherWrap(value: any): string {
        let result = '';
        let me = this;

        switch (typeof value) {
            case 'string':
                result += `"${value}"`;
                break;
            case 'boolean':
                result += `${value}`;
                break;
            case 'number':
                result += `${value}`;
                break;
            case 'object':
                if (value instanceof Array && Array.isArray(value)) {
                    let ree = '';
                    value.forEach(element => {
                        let see = me.otherWrap(element);
                        ree = ree.concat(see).concat(',');
                    });
                    ree = ree.substr(0, ree.length - 1);
                    result += `[${ree}]`;
                } else if (value instanceof GeeoMap) {
                    result += `${me.geeomapWrap(value)}`;
                } else if (value instanceof Entity) {
                    result += `${me.wrap(value)}`;
                } else if (value instanceof Node) {
                    result += `${value.toString()}`;
                } else {
                    result += `${JSON.stringify(value)}`;
                }
                break;
            case 'undefined':
                result += `null`;
                break;
            default:
                result += `${JSON.stringify(value)}`;
                break;
        }

        return result;
    }

    /**
     * Wraps all of the Entity.
     *
     * @param {Entity} entity
     * @returns {string} JSON-String of Entity.
     * @memberof Package
     */
    public wrap(entity: Entity): string {
        let me = this;
        if (entity == null) {
            return 'null';
        } else {
            let props = this.geeomapWrap(entity.getParameters());
            let json = JSON.parse(props);

            let wrapped: PackageWrapped = {
                [entity.getType()]: json,
            };

            return JSON.stringify(wrapped);
        }
    }
}
/**
 *
 *
 * @interface PackageWrapped
 */
interface PackageWrapped {
    [propName: string]: Object;
}

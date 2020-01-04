import * as fs from 'fs';
import * as path from 'path';
import Node from '../Crypt';
import { GeeoMap } from '../GeeoMap';
import compareEntities from './Comparison';
import Device from '../Device';
import System from '../System';
import { EventEmitter } from 'events';

class ENTITY_PATHS {
    static USER: Function = (username: string) => {
        let p = path.join(
            process.cwd(),
            `saved/entities/users/${Buffer.from(username, 'utf8').toString(
                'hex'
            )}`
        );
        return p;
    };
    static SAFE: Function = (username: string, safename: string) => {
        return path.join(
            process.cwd(),
            `saved/entities/users/${Buffer.from(username, 'utf8').toString(
                'hex'
            )}/safes/${Buffer.from(safename, 'utf8').toString('hex')}`
        );
    };
    static DEVICE: Function = (mac_hex: string) => {
        return path.join(process.cwd(), `saved/device/${mac_hex}/`);
    };
    static DATABASE: Function = (name: string) => {
        return path.join(
            process.cwd(),
            `saved/database/${Buffer.from(name, 'utf8').toString('hex')}/`
        );
    };
    static DEFAULT: Function = (name: string) => {
        return path.join(
            process.cwd(),
            `saved/enities/unknown/${Buffer.from(name, 'utf8').toString(
                'hex'
            )}/`
        );
    };
}
/**
 *Entity Class
 *
 * @export
 * @class Entity
 */
export default class Entity extends EventEmitter {
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
        super();
        this.addParameter('type', type);
        this.addParameter('name', name);
        this.addParameter('created', Date.now());
        this.addParameter('last_saved', null);
        // this.on('update', this.save);
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
        if(this.hasParameter('last_loaded')){
            let date = this.getParameter('last_loaded');
            return new Date(Number.parseInt(date.toString()));
        }else {
            return null;
        }
        
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
        this.emit('update');
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
    protected compare(object: any): Object {
        let result = {};
        if (object.type) {
            if (object.type !== this.getType()) {
                result = {};
            } else {
                result = compareEntities(object, JSON.parse(this.toString()));
            }
        } else {
            result = compareEntities(object, JSON.parse(this.toString()));
        }
        return result;
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
    public save(): boolean {
        let result = false;
        let type = this.getType();
        let entity_path: string = ENTITY_PATHS.DEFAULT(this.getName());
        switch (type) {
            case 'user':
                entity_path = ENTITY_PATHS.USER(
                    this.getParameter('name').toString()
                );
                break;
            case 'safe':
                entity_path = ENTITY_PATHS.SAFE(
                    this.getParameter('user').toString(),
                    this.getName()
                );
                break;
            case 'database':
                entity_path = ENTITY_PATHS.DATABASE(this.getName());
                break;
            case 'device':
                entity_path = ENTITY_PATHS.DEVICE(this.getName());
                break;
            default:
                entity_path = ENTITY_PATHS.DEFAULT(this.getName());
                break;
        }

        if (!fs.existsSync(entity_path)) {
            fs.mkdirSync(entity_path);
            let snaps_folder = path.join(entity_path, 'snapshots/');
            if (!fs.existsSync(snaps_folder)) {
                fs.mkdirSync(snaps_folder);
            }
        }
        let final_E_path = path.join(
            entity_path,
            'snapshots/',
            Date.now().toString()
        );
        let dev: Device = System.getDevice();
        let pk = dev.getPrivateKey('admin');

        if (this.getType() === 'user') {
            pk = dev.getPrivateKey(this.getName());
        } else if (this.getType() === 'safe') {
            pk = dev.getPrivateKey(this.getParameter('user').toString());
        }
        this.addParameter('last_saved', Date.now());
        try {
            fs.writeFileSync(
                final_E_path,
                (() => {
                    result = true;
                    let encrypted = new Node(this.toString(), {
                        privateKey: pk,
                    }).encryptText();
                    return encrypted;
                })()
            );
        } catch (error) {
            console.error(error);
        }
        return result;
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
                            re += this.geeomapWrap(value);
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
                        let wrappedCorrect = this.otherWrap(value);
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
                        let see = this.otherWrap(element);
                        ree = ree.concat(see).concat(',');
                    });
                    ree = ree.substr(0, ree.length - 1);
                    result += `[${ree}]`;
                } else if (value instanceof GeeoMap) {
                    result += `${this.geeomapWrap(value)}`;
                } else if (value instanceof Entity) {
                    result += `${this.wrap(value)}`;
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

interface IChanges {
    date: number;
    removed?: GeeoMap<string, any>;
    added?: GeeoMap<string, any>;
    altered?: GeeoMap<string, any>; //updated
}

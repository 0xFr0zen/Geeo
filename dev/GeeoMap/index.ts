import { TSMap } from 'typescript-map';
import Entity from '../Entity';

export class GeeoMap<K, V> extends TSMap<K, V> {
    constructor() {
        super();
    }

    /**
     * Adding an Item based on the name
     *
     *
     * @param {K} key Name of the Object
     * @param {V} value Object to be added
     * @returns {GeeoMap<K, V>}
     * @memberof GeeoMap
     */
    public addItem(key: K, value: V): GeeoMap<K, V> {
        return this.set(key, value);
    }

    /**
     * Removing an Item based on the name
     *
     * @param {K} key
     * @returns {boolean}
     * @memberof GeeoMap
     */
    public removeItem(key: K): boolean {
        return this.delete(key);
    }

    /**
     * Checks if Item exists
     *
     * @param {K} key
     * @returns {boolean}
     * @memberof GeeoMap
     */
    public hasItem(key: K): boolean {
        return this.has(key);
    }

    /**
     * Returns the Item based on the name
     *
     * @param {K} key
     * @returns {V}
     * @memberof GeeoMap
     */
    public getItem(key: K): V {
        return this.get(key);
    }

    /**
     * Return to Stringified version of GeeoMap
     *
     * @returns {string}
     * @memberof GeeoMap
     */
    public toString(): string {
        let result = '';
        let keys: K[] = this.keys();
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            let value: V = this.get(key);
            let r = '';
            switch (typeof value) {
                case 'object':
                    if (value instanceof GeeoMap) {
                        r = value.toString();
                    } else if (value instanceof Entity) {
                        r = value.toString();
                    }else {
                        r = JSON.stringify(value);
                    }
                    break;

                default:
                    r = value.toString();
                    break;
            }
            result = result
                .concat(`"${key}":`)
                .concat(r)
                .concat(`,`);
        }
        result = '{'.concat(result.substr(0, result.length - 1).concat('}'));
        return result;
    }

    /**
     * toString overwrite
     *
     * @returns {string}
     * @memberof GeeoMap
     */
    public inspect(): string {
        return this.toString();
    }
}

import User from '../Entity/User/index';
import { GeeoMap } from '../GeeoMap/index';
import { EventEmitter } from 'events';
namespace Inventories {
    export class Item {
        public name: string;
        public type: ItemType;
        public value: any;
    }

    export class GeeoInventory extends EventEmitter {
        private user: User = null;
        private items: ItemList = new ItemList();
        constructor(user?: User) {
            super();
            this.user = user;
        }
        public assignUser(user: User): GeeoInventory {
            this.user = user;
            return this;
        }
        public getList(filter?: ItemFilter): Array<Item> {
            return this.items.list();
        }
        public addAll(itemslist: ItemList | Item[]): GeeoInventory {
            if (itemslist instanceof ItemList) {
                this.items.addAll(itemslist);
                this.emit('listadded', itemslist.length());
            } else {
                this.items.addAll(ItemListFormatter.format(itemslist));
                this.emit('listadded', itemslist.length);
            }
            return this;
        }
        public getItem(name: string) {
            return this.items.getItem(name);
        }
        public add(item: Item): GeeoInventory {
            this.items = this.items.addItem(item);
            this.emit('added', item);
            return this;
        }
        public remove(filter: string): GeeoInventory {
            let item = this.items.getItem(filter);
            this.items = this.items.removeItem(filter);
            this.emit('removed', item);
            return this;
        }
        public static from(items: ItemList | any[]): GeeoInventory {
            let inv = new GeeoInventory();
            if (items instanceof ItemList) {
                inv.addAll(items);
            } else {
                inv.addAll(ItemListFormatter.format(items));
            }

            return inv;
        }
        public getUser(): User {
            return this.user;
        }
        public hasUser(): boolean {
            return this.user !== null;
        }
    }
    export interface ItemFilter {
        type?: ItemType;
        text?: string;
        index?: number;
    }
    export enum ItemType {
        ANY = 'ANY',
        DOCUMENT = 'DOCUMENT',
        PRODUCT = 'PRODUCT',
        MAIL = 'MAIL',
    }
    export class ItemList {
        private items: Item[] = [];
        public length(): number {
            return this.items.length;
        }
        public addItem(item: Item): ItemList {
            this.items.push(item);
            return this;
        }
        public getItem(name: string): Item {
            return this.items.find(item => {
                return item.name === name;
            });
        }
        public removeItem(element: string | Item): ItemList {
            let filter: any = null;
            if (typeof element === 'string') {
                filter = (item: Item) => {
                    return item.name === element;
                };
            } else {
                filter = (item: Item) => {
                    return item === element;
                };
            }
            let foundItemIndex = this.items.findIndex(filter);
            this.items = this.items.splice(foundItemIndex, 1);
            this.items.sort();
            return this;
        }
        public addAll(itemslist: ItemList) {
            this.items.push(...itemslist.items);
        }
        public list(): Array<Item> {
            return this.items;
        }
    }
    abstract class ItemListFormatter {
        public static format(array: Array<Item>): ItemList {
            let il: ItemList = new ItemList();
            array.forEach((v, i) => {
                il = il.addItem(v);
            });
            return il;
        }
    }
}

export default Inventories;

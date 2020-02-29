import User from '../Entity/User/index';
import { GeeoMap } from '../GeeoMap/index';
namespace Inventories {
    export interface Item {
        name: string;
        value: any;
    }

    export class GeeoInventory {
        private user: User = null;
        private items: GeeoMap<string, any> = new GeeoMap<string, any>();
        constructor(user?: User) {
            this.user = user;
        }
        public getItemList(filter?: ItemFilter): ItemList {
            return this.items;
        }
        public addAll(itemslist: ItemList) {
            itemslist.forEach((v: Item, i) => {
                this.items.addItem(v.name, v.value);
            });
            return this;
        }
        public add(itemname: string, item: any) {
            this.items.addItem(itemname, item);
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
    }
    export interface ItemFilter {
        type?: ItemType;
        text?: string;
        index?: number;
    }
    export enum ItemType {
        ANY,
        DOCUMENT,
        PRODUCT,
        MAIL,
    }
    export class ItemList extends GeeoMap<string, any> {}
    abstract class ItemListFormatter {
        public static format(array: Array<Item>): ItemList {
            let il: ItemList = new ItemList();
            // console.log();

            array.forEach((v, i) => {
                il.addItem(v.name, v.value);
            });
            return il;
        }
    }
}

export default Inventories;

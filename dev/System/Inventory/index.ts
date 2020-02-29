import User from '../Entity/User/index';
export default class Inventory {
    private user: User = null;
    constructor(user?: User) {
        this.user = user;
    }
    public getItemList(filter?: ItemFilter): ItemList {
        ItemListFormatter.format([{ test: 'test' }]);
        return null;
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
export interface ItemList {
    [name: string]: any;
}
abstract class ItemListFormatter {
    public static format(array: Array<any>): ItemList {
        let il: ItemList = {};
        Object.keys(array).forEach((v, i) => {
            console.log(typeof v);
        });
        return;
    }
}

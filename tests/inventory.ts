import Inventories from '../dev/System/Inventory/index';
import User from '../dev/System/Entity/User/index';
let compare = (o1: any, o2: any): boolean => {
    console.log(o1, o2);
    return (
        Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1) === Object.keys(o2)
    );
};
let testinput: Inventories.Item[] = [
    { name: 'test', type: Inventories.ItemType.ANY, value: 'testvalue' },
];
let inventory: Inventories.GeeoInventory = new Inventories.GeeoInventory();
inventory.addAll(testinput);
console.log(compare(inventory.getList(), testinput));



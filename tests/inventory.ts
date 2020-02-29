import Inventories from '../dev/System/Inventory/index';
let testinput: Inventories.Item[] = [{ name: 'test', value: 'testvalue' }];
let inventory: Inventories.GeeoInventory = Inventories.GeeoInventory.from(
    testinput
);
console.log(inventory.getItemList());

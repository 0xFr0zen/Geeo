import Inventories from '../dev/System/Inventory/index';
let testinput: Inventories.Item[] = [
    { name: 'test', type: Inventories.ItemType.ANY, value: 'testvalue' },
];
let inventory: Inventories.GeeoInventory = Inventories.GeeoInventory.from(
    testinput
);
inventory.on('added', (item: Inventories.Item) => {
    console.log(`added item '${item.name}'`);
});
inventory.on('removed', (item: any) => {
    console.log(`removed item '${item}'`);
});
inventory.add({ name: 's', type: Inventories.ItemType.PRODUCT, value: 'ADAD' });
inventory.remove('s');
console.log(inventory.getList());

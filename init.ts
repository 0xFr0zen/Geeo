import User from './dev/User/index';
import Node from './dev/Crypt/index';
import * as fs from 'fs';
import * as path from 'path';
import Safe from './dev/Safe';
import { StorageType } from './dev/Safe/index';

let oe = new User("oezguer.isbert");
let safe = new Safe('friends',StorageType.Inventory);
safe.addItem('max', {books:["TEST",123, {m:false}]});
oe.addSafe(safe);
// console.log(oe.getNode().toString());

// console.log(oe.getSafe('documents').toString());
oe.save();
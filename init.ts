import User from './dev/User/index';
import Node from './dev/Crypt/index';
import * as fs from 'fs';
import * as path from 'path';
import Safe from './dev/Safe';
import { StorageType } from './dev/Safe/index';
import Identity from './dev/Identity/index';


let i = new Identity();
let prK = i.getPrivateKey();
let pbK = i.getPrivateKey();
console.log(prK, pbK);


// let oe = new User("oezguer");
// console.log(oe.getChanges().getItem('added'));

// oe.save();
import User from './dev/User/index';
import Node from './dev/Crypt/index';
import * as fs from 'fs';
import * as path from 'path';
import Safe from './dev/Safe';
import { StorageType } from './dev/Safe/index';

let oe = new User("oezguer");
console.log(oe.getChanges().getItem('added'));

// oe.save();
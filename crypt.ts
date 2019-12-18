import Node from './dev/Crypt';
import * as fs from 'fs';
import * as path from 'path';
import Database from './dev/Database';

let profile = {
    user:"root",
    pass:"root"
};
let file = JSON.stringify(profile);
console.log('f', file);

let encrypted = new Node(file).toString();

let s = new Node(encrypted, true).toString();
console.log('s', s);

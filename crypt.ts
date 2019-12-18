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
let encrypted_obj = JSON.parse(encrypted);
let s = new Node(encrypted_obj.data, encrypted_obj.iv).toString();
console.log('s', s);

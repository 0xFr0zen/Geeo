import Node from './dev/Crypt';
import * as fs from 'fs';
import * as path from 'path';
import { Edon } from './dev/Crypt';
import Database from './dev/Database';

let file = fs.readFileSync(Database.GeeoCypherFile);

let b = Buffer.from(file.toString(), 'hex').toString('base64');
console.log(b);
let decrypted = new Edon(file).toString();


let j = JSON.parse(decrypted);
j.admins.forEach((admin:string) => {
    
    let s = new Edon(admin).toString();
    console.log(s);
});
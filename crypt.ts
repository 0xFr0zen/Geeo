import Node from './dev/Crypt';
import * as fs from 'fs';
import * as path from 'path';
import { Edon } from './dev/Crypt';
import Database from './dev/Database';


let decrypted = new Edon(fs.readFileSync(Database.GeeoCypherFile)).toString();


let j = JSON.parse(decrypted);
j.admins.forEach((admin:string) => {
    
    let s = new Edon(admin).toString();
    console.log(s);
});
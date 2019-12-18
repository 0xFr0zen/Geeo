import Node from './dev/Crypt';
import * as fs from 'fs';
import Database from './dev/Database';
import * as path from 'path';

interface IDBUser {
    username: string;
    password: string;
}
let admin1: IDBUser = {
    username: 'geeo_admin_penetrator',
    password: '123456789',
}; //GET from Server pre configured (encrypted string);
let x = new Node(JSON.stringify(admin1)).toString();
fs.writeFileSync(
    path.join(Database.GeeoDatabaseRoot, './admin-user.geeocypher'),
    x
);
let e = new Node(
    fs
        .readFileSync(
            path.join(Database.GeeoDatabaseRoot, './admin-user.geeocypher')
        )
        .toString(),
    true
).toString();

admin1 = JSON.parse(e);
let db = new Database();

let result = db.query(
    fs
        .readFileSync(path.join(Database.GeeoDatabaseRoot, './cu.sql'))
        .toString(),
    [admin1.username, admin1.password]
);
console.log(result);

// let admin = new Node(JSON.stringify(admin1)).toString();
// let dbusers:any = {
//     admins: [admin],
//     normals: [],
//     demos: [],
// };
// let node = new Node(JSON.stringify(dbusers));
// let encrypted = node.toString();
// fs.writeFileSync(Database.GeeoCypherFile, encrypted);

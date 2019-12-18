"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Crypt_1 = require("./dev/Crypt");
var Crypt_2 = require("./dev/Crypt");
var fs = require("fs");
var Database_1 = require("./dev/Database");
var path = require("path");
var admin1 = {
    username: 'geeo_admin_penetrator',
    password: '123456789',
};
var x = new Crypt_1.default(JSON.stringify(admin1)).toString();
fs.writeFileSync(path.join(Database_1.default.GeeoDatabaseRoot, './admin-user.geeocypher'), x);
var e = new Crypt_2.Edon(fs
    .readFileSync(path.join(Database_1.default.GeeoDatabaseRoot, './admin-user.geeocypher'))
    .toString()).toString();
admin1 = JSON.parse(e);
var db = new Database_1.default();
var result = db.query(fs
    .readFileSync(path.join(Database_1.default.GeeoDatabaseRoot, './cu.sql'))
    .toString(), [admin1.username, admin1.password]);
console.log(result);

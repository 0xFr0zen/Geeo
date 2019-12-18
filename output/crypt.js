"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Crypt_1 = require("./dev/Crypt");
var Database_1 = require("./dev/Database");
var decrypted = new Crypt_1.Edon(fs.readFileSync(Database_1.default.GeeoCypherFile)).toString();
var j = JSON.parse(decrypted);
j.admins.forEach(function (admin) {
    var s = new Crypt_1.Edon(admin).toString();
    console.log(s);
});

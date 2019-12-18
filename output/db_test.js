"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./dev/Database/index");
var db = new index_1.default();
var result = db.query("use m104;select * from ?", ["ort"]);
console.log(result);

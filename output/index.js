"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("./dev/User");
var Safe_1 = require("./dev/Safe");
var user = new User_1.default('oezguerisbert');
var ks = new Safe_1.default('ks')
    .addItem('products', ['Coca Cola', 'Fanta', 'Smirnoff'])
    .removeItem('products');
user.addSafe(ks);
user.getSafe('documents').addItem('loans', [990.00]);
user.save();

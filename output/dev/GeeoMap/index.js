"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_map_1 = require("typescript-map");
var Entity_1 = require("../Entity");
var GeeoMap = (function (_super) {
    __extends(GeeoMap, _super);
    function GeeoMap() {
        return _super.call(this) || this;
    }
    GeeoMap.prototype.addItem = function (key, value) {
        return this.set(key, value);
    };
    GeeoMap.prototype.removeItem = function (key) {
        return this.delete(key);
    };
    GeeoMap.prototype.hasItem = function (key) {
        return this.has(key);
    };
    GeeoMap.prototype.getItem = function (key) {
        return this.get(key);
    };
    GeeoMap.prototype.toString = function () {
        var result = '';
        var keys = this.keys();
        for (var index = 0; index < keys.length; index++) {
            var key = keys[index];
            var value = this.get(key);
            var r = '';
            switch (typeof value) {
                case 'object':
                    if (value instanceof GeeoMap) {
                        r = value.toString();
                    }
                    else if (value instanceof Entity_1.default) {
                        r = value.toString();
                    }
                    else {
                        r = JSON.stringify(value);
                    }
                    break;
                default:
                    r = value.toString();
                    break;
            }
            result = result
                .concat("\"" + key + "\":")
                .concat(r)
                .concat(",");
        }
        result = '{'.concat(result.substr(0, result.length - 1).concat('}'));
        return result;
    };
    GeeoMap.prototype.inspect = function () {
        return this.toString();
    };
    return GeeoMap;
}(typescript_map_1.TSMap));
exports.GeeoMap = GeeoMap;

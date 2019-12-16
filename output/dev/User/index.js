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
var Entity_1 = require("../Entity");
var fs = require("fs");
var path = require("path");
var Safe_1 = require("../Safe");
var User = (function (_super) {
    __extends(User, _super);
    function User(name) {
        var _this = _super.call(this, 'user', name) || this;
        _this.addParameter('settings', '');
        _this.addParameter('storages', []);
        _this.addSafe(new Safe_1.default("documents"));
        return _this;
    }
    User.prototype.addSafe = function (storage) {
        var result = false;
        var storages = this.getParameter('storages');
        if (storages != null && Array.isArray(storages)) {
            if (storages.length < storages.push(storage)) {
                this.update('storages', storages);
                result = true;
            }
        }
        return result;
    };
    User.prototype.getSafe = function (name) {
        var result = null;
        var storages = this.getParameter('storages');
        if (storages != null && Array.isArray(storages)) {
            result = storages.filter(function (storage) {
                return storage.getName() === name;
            })[0];
        }
        return result;
    };
    User.prototype.inspect = function () {
        return this.toString();
    };
    User.prototype.save = function () {
        var me = this;
        var result = false;
        fs.writeFileSync(path.join(path.dirname(require.main.filename), this.getName().concat('.json')), (function () {
            result = true;
            return me.toString();
        })());
        return result;
    };
    return User;
}(Entity_1.default));
exports.User = User;
exports.default = User;

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
var GeeoMap_1 = require("../GeeoMap");
var StorageType;
(function (StorageType) {
    StorageType["Inventory"] = "inventory";
    StorageType["Documents"] = "documents";
})(StorageType = exports.StorageType || (exports.StorageType = {}));
var Safe = (function (_super) {
    __extends(Safe, _super);
    function Safe(name, storagetype) {
        if (storagetype === void 0) { storagetype = StorageType.Inventory; }
        var _this = _super.call(this, 'safe', name) || this;
        _this.addParameter('storagetype', storagetype);
        _this.addParameter('space', new GeeoMap_1.GeeoMap());
        return _this;
    }
    Safe.prototype.getSpace = function () {
        var result = null;
        var s = this.getParameter('space');
        if (s instanceof GeeoMap_1.GeeoMap) {
            result = s;
        }
        return result;
    };
    Safe.prototype.addItem = function (name, item) {
        this.update('space', this.getSpace().addItem(name, item));
        return this;
    };
    Safe.prototype.getItem = function (name) {
        return this.getSpace().getItem(name);
    };
    Safe.prototype.removeItem = function (name) {
        var space = this.getSpace();
        space.removeItem(name);
        this.update('space', space);
        return this;
    };
    Safe.prototype.save = function () {
        var result = true;
        var s = this.toString();
        fs.writeFileSync(path.join(path.dirname(require.main.filename), this.getName() + ".json"), s);
        return result;
    };
    return Safe;
}(Entity_1.default));
exports.default = Safe;

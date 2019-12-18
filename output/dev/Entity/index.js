"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Crypt_1 = require("../Crypt");
var index_1 = require("../GeeoMap/index");
var Entity = (function () {
    function Entity(type, name) {
        this.parameters = new index_1.GeeoMap();
        this.addParameter('type', type);
        this.addParameter('name', name.toString());
        this.addParameter('created', Date.now());
        this.addParameter('node', new Crypt_1.default(this));
        this.addParameter('last_saved', null);
        this.addParameter('last_loaded', Date.now());
        this.addParameter('updated', []);
        this.addParameter('removed', null);
    }
    Entity.prototype.getName = function () {
        var name = this.getParameter('name');
        return name.toString();
    };
    Entity.prototype.getType = function () {
        var type = this.getParameter('type');
        return type.toString();
    };
    Entity.prototype.getNode = function () {
        var x = this.getParameter('node');
        if (x instanceof Crypt_1.default) {
            return x;
        }
        else {
            return null;
        }
    };
    Entity.prototype.getParameters = function () {
        return this.parameters;
    };
    Entity.prototype.getParameter = function (key) {
        return this.parameters.hasItem(key)
            ? this.parameters.getItem(key)
            : null;
    };
    Entity.prototype.addParameter = function (key, obj) {
        if (this.parameters.hasItem(key)) {
            this.update(key, obj);
        }
        else {
            this.parameters = this.parameters.addItem(key, obj);
        }
    };
    Entity.prototype.hasParameter = function (key) {
        return this.parameters.hasItem(key);
    };
    Entity.prototype.removeParameter = function (key) {
        this.parameters.removeItem(key);
    };
    Entity.prototype.update = function (key, value) {
        this.parameters = this.parameters.addItem(key, value);
        var node = this.getParameter('node');
        var old = this.getParameter('updated');
        if (node instanceof Crypt_1.default) {
            node.update(this);
            this.parameters = this.parameters.addItem('node', node);
        }
        if (Array.isArray(old)) {
            old.push(Date.now());
            this.parameters = this.parameters.addItem('updated', old);
        }
    };
    Entity.prototype.grantAccess = function (username) {
        var o = this.getAccessList();
        var access = [];
        if (Array.isArray(o)) {
            access = o;
        }
        access.push(username);
        this.update('access', access);
    };
    Entity.prototype.revokeAccess = function (username) {
        var o = this.getAccessList();
        var access = [];
        if (Array.isArray(o)) {
            access = o;
        }
        access = access.filter(function (name) {
            return name !== username;
        });
        this.update('access', access);
    };
    Entity.prototype.getAccessList = function () {
        var o = this.getParameter('access');
        var access = [];
        if (Array.isArray(o)) {
            access = o;
        }
        return access;
    };
    Entity.prototype.toString = function () {
        var packager = new Package();
        return packager.wrap(this).toString();
    };
    return Entity;
}());
exports.default = Entity;
var Package = (function () {
    function Package() {
    }
    Package.prototype.geeomapWrap = function (gm) {
        var _this = this;
        var result = '';
        var me = this;
        var keys = gm.keys();
        if (keys.length > 0) {
            keys.forEach(function (key) {
                var value = gm.get(key);
                var re = "\"" + key + "\":";
                if (value === null) {
                    re += 'null';
                }
                else {
                    if (value instanceof index_1.GeeoMap) {
                        if (value.length > 0) {
                            re += me.geeomapWrap(value);
                        }
                        else {
                            re += '{}';
                        }
                    }
                    else if (value instanceof Entity) {
                        var json = _this.wrap(value);
                        if (json === '{}') {
                            re += '{}';
                        }
                        else {
                            var m = json.substring(1, json.length - 1);
                            re += m;
                        }
                    }
                    else {
                        var wrappedCorrect = me.otherWrap(value);
                        re += wrappedCorrect;
                    }
                }
                result += re.concat(',');
            });
            result = '{'.concat(result.substr(0, result.length - 1).concat('}'));
        }
        else {
            result = '{}';
        }
        return result;
    };
    Package.prototype.otherWrap = function (value) {
        var result = '';
        var me = this;
        switch (typeof value) {
            case 'string':
                result += "\"" + value + "\"";
                break;
            case 'boolean':
                result += "" + value;
                break;
            case 'number':
                result += "" + value;
                break;
            case 'object':
                if (value instanceof Array && Array.isArray(value)) {
                    var ree_1 = '';
                    value.forEach(function (element) {
                        var see = me.otherWrap(element);
                        ree_1 = ree_1.concat(see).concat(',');
                    });
                    ree_1 = ree_1.substr(0, ree_1.length - 1);
                    result += "[" + ree_1 + "]";
                }
                else if (value instanceof index_1.GeeoMap) {
                    result += "" + me.geeomapWrap(value);
                }
                else if (value instanceof Entity) {
                    result += "" + me.wrap(value);
                }
                else {
                    result += "\"" + value.toString() + "\"";
                }
                break;
            case 'undefined':
                result += "null";
                break;
            default:
                result += "\"" + value.toString() + "\"";
                break;
        }
        return result;
    };
    Package.prototype.wrap = function (entity) {
        var _a;
        var me = this;
        if (entity == null) {
            return 'null';
        }
        else {
            var props = JSON.parse(this.geeomapWrap(entity.getParameters()));
            var wrapped = (_a = {},
                _a[entity.getType()] = props,
                _a);
            return JSON.stringify(wrapped);
        }
    };
    return Package;
}());
exports.Package = Package;

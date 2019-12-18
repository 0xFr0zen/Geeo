"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var GeeoCypher = (function () {
    function GeeoCypher() {
    }
    GeeoCypher.getCipher = function () {
        return GeeoCypher.cipher;
    };
    GeeoCypher.getIV = function () {
        return GeeoCypher.iv;
    };
    GeeoCypher.algorithm = crypto.getCiphers()[0];
    GeeoCypher.cipherJSON = JSON.parse(fs
        .readFileSync(path.join(path.dirname(require.main.filename), '../dev/.geeocipher'))
        .toString());
    GeeoCypher.iv = crypto.randomBytes(16);
    GeeoCypher.cipher = {
        password: GeeoCypher.cipherJSON.p,
    };
    return GeeoCypher;
}());
exports.GeeoCypher = GeeoCypher;
var Node = (function () {
    function Node(data) {
        this.privateValue = null;
        this.publicValue = '';
        this.key = null;
        var m = crypto.createHash('md5');
        m.update(GeeoCypher.getCipher().password);
        this.key = crypto.createCipheriv(GeeoCypher.algorithm, m.digest(), GeeoCypher.getIV());
        this.update(data);
    }
    Node.prototype.update = function (data) {
        var buffered = Buffer.from(data.toString(), 'utf8').toString('base64');
        this.publicValue = this.key
            .update(buffered, 'utf8', 'hex')
            .concat(this.key.final('hex'));
    };
    Node.prototype.toString = function () {
        return this.publicValue;
    };
    Node.prototype.inspect = function () {
        return this.toString();
    };
    return Node;
}());
exports.default = Node;
var Edon = (function () {
    function Edon(data) {
        this.privateValue = null;
        this.key = null;
        var m = crypto.createHash('md5');
        m.update(GeeoCypher.getCipher().password);
        this.key = crypto.createDecipheriv(GeeoCypher.algorithm, m.digest(), GeeoCypher.getIV());
        var b = Buffer.from(data, 'hex');
        this.privateValue = Buffer.from(this.key
            .update(b, 'hex', 'utf8')
            .concat(this.key.final('utf8')), 'base64').toString('utf8');
    }
    Edon.prototype.toString = function () {
        return this.privateValue;
    };
    return Edon;
}());
exports.Edon = Edon;

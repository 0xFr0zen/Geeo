"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var GeeoCrypt;
(function (GeeoCrypt) {
    var Node = (function () {
        function Node() {
            this.value = null;
            var current_date = new Date().valueOf().toString();
            var random = Math.random().toString();
            this.value = crypto
                .createHash('sha256')
                .update(current_date + random)
                .digest('hex').toString();
        }
        Node.prototype.toString = function () {
            return this.value.toString();
        };
        Node.prototype.inspect = function () {
            return this.toString();
        };
        return Node;
    }());
    GeeoCrypt.Node = Node;
})(GeeoCrypt || (GeeoCrypt = {}));
exports.default = GeeoCrypt;

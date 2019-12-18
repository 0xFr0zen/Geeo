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
var Crypt_1 = require("../Crypt");
var fs = require("fs");
var path = require("path");
var mysql = require("mysql");
var Database = (function (_super) {
    __extends(Database, _super);
    function Database(options) {
        if (options === void 0) { options = { port: 3306, username: 'root', password: '' }; }
        var _this = _super.call(this, 'database', 'db') || this;
        _this.addParameter('port', options.port | Database.MYSQL_PORT);
        _this.addParameter('pwd', options.password);
        _this.addParameter('username', options.username);
        if (Database.connection == null) {
            Database.connection = mysql.createConnection({
                localAddress: '127.0.0.1',
                connectTimeout: 60,
                user: options.username,
                password: options.username,
                port: options.port | Database.MYSQL_PORT,
                database: 'm104',
            });
            Database.connection.connect(function (err) {
                console.error(err);
            });
        }
        return _this;
    }
    Database.prototype.query = function (string, values) {
        var retresults = null;
        if (Database.connection != null) {
            Database.connection.query(string, values, function (error, results, fields) {
                if (error)
                    throw error;
                retresults = results;
            });
        }
        return retresults;
    };
    Database.exit = function () {
        if (Database.connection != null) {
            Database.connection.end();
        }
    };
    Database.GeeoDatabaseRoot = path.join(path.dirname(require.main.filename), '../config/db/');
    Database.GeeoCypherFile = path.join(Database.GeeoDatabaseRoot, './users.geeocypher');
    Database.MYSQL_PORT = 3306;
    Database.connection = null;
    return Database;
}(Entity_1.default));
exports.default = Database;
var DatabaseUser = (function (_super) {
    __extends(DatabaseUser, _super);
    function DatabaseUser(username) {
        var _this = _super.call(this, 'dbuser', username) || this;
        var json = JSON.parse(new Crypt_1.Edon(fs
            .readFileSync(path.join(Database.GeeoDatabaseRoot, './admin-user.geeocypher'))
            .toString()).toString());
        _this.addParameter('username', json['username']);
        _this.addParameter('password', new Crypt_1.Edon(json['password']).toString());
        return _this;
    }
    DatabaseUser.prototype.getUsername = function () {
        var result = null;
        var p = this.getParameter('username');
        if (typeof p === 'string') {
            result = p;
        }
        return result;
    };
    DatabaseUser.prototype.getPassword = function () {
        var result = null;
        var p = this.getParameter('password');
        if (typeof p === 'string') {
            result = p;
        }
        return result;
    };
    return DatabaseUser;
}(Entity_1.default));
exports.DatabaseUser = DatabaseUser;

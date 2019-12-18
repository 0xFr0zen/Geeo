import Entity from '../Entity';
import { Edon } from '../Crypt';
import * as fs from 'fs';
import * as path from 'path';
import * as mysql from 'mysql';

export default class Database extends Entity {
    public static readonly GeeoDatabaseRoot = path.join(
        path.dirname(require.main.filename),
        '../config/db/'
    );
    public static readonly GeeoCypherFile = path.join(
        Database.GeeoDatabaseRoot,
        './users.geeocypher'
    );
    private static MYSQL_PORT: number = 3306;
    private static connection: mysql.Connection = null;
    constructor(options = { port: 3306, username: 'root', password: '' }) {
        super('database', 'db');
        this.addParameter('port', options.port | Database.MYSQL_PORT);
        this.addParameter('pwd', options.password);
        this.addParameter('username', options.username); //get from Randomized Database user.

        if (Database.connection == null) {
            Database.connection = mysql.createConnection({
                localAddress: '127.0.0.1',
                connectTimeout:60,
                user: options.username,
                password: options.username,
                port: options.port | Database.MYSQL_PORT,
                database: 'm104',
            });
            
            Database.connection.connect(function(err){
                console.error(err)
            });
        }
    }
    public query(string: string, values: any[]): any {
        let retresults = null;
        if (Database.connection != null) {
            Database.connection.query(string, values, function(
                error,
                results,
                fields
            ) {
                if (error) throw error;
                retresults = results;
            });
        }
        return retresults;
    }
    public static exit() {
        if (Database.connection != null) {
            Database.connection.end();
        }
    }
}
export class DatabaseUser extends Entity {
    constructor(username: string) {
        super('dbuser', username);
        let json = JSON.parse(
            new Edon(
                fs
                    .readFileSync(
                        path.join(
                            Database.GeeoDatabaseRoot,
                            './admin-user.geeocypher'
                        )
                    )
                    .toString()
            ).toString()
        );
        this.addParameter('username', json['username']);
        this.addParameter('password', new Edon(json['password']).toString());
    }
    public getUsername(): string {
        let result = null;
        let p = this.getParameter('username');
        if (typeof p === 'string') {
            result = p;
        }
        return result;
    }
    public getPassword(): string {
        let result = null;
        let p = this.getParameter('password');
        if (typeof p === 'string') {
            result = p;
        }
        return result;
    }
}

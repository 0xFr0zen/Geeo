import * as path from 'path';
import * as mysql from 'mysql';
interface IDatabase {
    username: string;
    password: string;
}
export class Result {
    private res:any = {};
    constructor(res:any){
        this.res = res;
    }
    public getColumns():string[] {
        return Object.keys(this.res);
    }
    public getRow(column:string){
        this.res[column];
    }
}
export default class Database {
    public static readonly GeeoDatabaseRoot = path.join(
        process.cwd(),
        './config/db/'
    );
    private static MYSQL_PORT: number = 3306;
    private connection: mysql.Connection = null;
    private port: number = Database.MYSQL_PORT;
    private username: string = '';
    private pwd: string = '';
    private static connections: mysql.Connection[] = [];
    constructor(
        name: string,
        options: IDatabase = { username: 'root', password: '' }
    ) {
        // super();
        this.port = Database.MYSQL_PORT!;
        this.pwd = options.password;
        this.username = options.username;

        if (this.connection == null) {
            let dboptions: mysql.ConnectionConfig = {
                insecureAuth: false,
                multipleStatements: true,
                localAddress: '127.0.0.1',
                connectTimeout: 60000,
                user: this.username,
                password: this.pwd,
                port: this.port,
                database: name,
            };
            this.connection = mysql.createConnection(dboptions);

            this.connection.connect((err, ...argss) => {
                if (err) {
                    console.log(err, argss);
                } else {
                    Database.connections.push(this.connection);
                }
            });
        }
    }
    public query(string: string, values?: any[]): Promise<Result[]> {
        return new Promise((resolve, reject) => {
            let retresults: Result[] = [];
            if (this.connection != null) {
                if (values) {
                    this.connection.query(
                        string,
                        values,
                        async (error, results, fields) => {
                            if (error) reject(error);
                            retresults = await this.parseResult(results);
                            resolve(retresults);
                        }
                    );
                } else {
                    this.connection.query(
                        string,
                        async (error, results, fields) => {
                            if (error) reject(error);
                            retresults = await this.parseResult(results);

                            resolve(retresults);
                        }
                    );
                }
            } else {
                reject(new Error('no connection'));
            }
        });
    }
    parseResult(results: any): PromiseLike<any[]> {
        return new Promise((resolve, reject) => {
            if (results.length == 0) {
                reject([]);
            }
            let result: Result[] = [];
            for (const key in results) {
                let colnames: string[] = Object.keys(results[key]);

                let s: any = {};
                colnames.forEach(col => {
                    s[col] = results[key][col];
                });
                let r:Result = new Result(s);
                result.push(r);
            }
            resolve(result);
        });
    }
    public close() {
        if (this.connection != null) {
            this.connection.end();
        }
    }
    public static exitAll() {
        Database.connections.forEach((con: mysql.Connection) => con.end());
    }
}
export class DatabaseUser {
    private username: string = '';
    private password: string = '';
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
    public getUsername(): string {
        return this.username;
    }
    public getPassword(): string {
        return this.password;
    }
}

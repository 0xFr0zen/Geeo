import * as path from 'path';
import * as mysql from 'mysql';
interface IDatabase {
    username: string;
    password: string;
}
export class Result {
    private res: any = null;
    constructor(res: any) {
        this.res = res;
    }
    public getColumns(): string[] {
        return Object.keys(this.res);
    }
    public hasColumn(name: string): boolean {
        return this.getColumns().indexOf(name) > -1;
    }
    public getRow(column: string): any {
        return this.res[column];
    }
}
export default class Database {
    public static readonly GeeoDatabaseRoot = path.join(
        process.cwd(),
        './config/db/'
    );
    private static MYSQL_PORT: number = 3306;
    private pool: mysql.Pool = null;
    private port: number = Database.MYSQL_PORT;
    private username: string = '';
    private pwd: string = '';
    private static connections: mysql.Connection[] = [];
    private dboptions: mysql.PoolConfig;
    constructor(
        name: string,
        options: IDatabase = { username: 'root', password: '' }
    ) {
        // super();
        this.port = Database.MYSQL_PORT!;
        this.pwd = options.password;
        this.username = options.username;

        if (this.pool == null) {
            this.dboptions = {
                insecureAuth: false,
                multipleStatements: true,
                localAddress: '127.0.0.1',
                connectTimeout: 60000,
                user: this.username,
                password: this.pwd,
                port: this.port,
                database: name,
                connectionLimit: 5,
                waitForConnections: true,
                queueLimit: 10,
            };
            this.pool = mysql.createPool(this.dboptions);

            this.pool.on('error', error => {
                console.log(error);
            });
            this.pool.on('connection', connection => {
                console.log(connection.state);
            });
        }
    }
    public query(string: string, values?: any[]): Promise<Result[]> {
        return new Promise(async (resolve, reject) => {
            let retresults: Result[] = [];
            if (this.pool != null) {
                try {
                    this.pool.getConnection((err, connection) => {
                        if (err) return reject(err.message);
                        connection.connect(err => {
                            return reject(err.message);
                        });
                        if (values) {
                            connection
                                .query(string, values, (err, res, fields) => {
                                    if (err) return reject(err.message);
                                    console.log(res);
                                })
                                .on('result', async (row, index) => {
                                    // console.log('result', row, index);
                                    let s = await this.parseResult(row);
                                    retresults.push(s);
                                    console.log('res', s);

                                    return resolve(retresults);
                                })
                                .on('error', error => {
                                    return reject(error.message);
                                });
                        } else {
                            connection
                                .query(string)
                                .on('result', async (row, index) => {
                                    // console.log('result', row, index);
                                    let s = await this.parseResult(row);
                                    retresults.push(s);
                                    return resolve(retresults);
                                })
                                .on('error', error => {
                                    return reject(error.message);
                                });
                        }
                        connection.release();
                    });
                } catch (e) {
                    return reject(e);
                }
            } else {
                return reject('no connection');
            }
        });
    }

    private parseResult(givenresult: any): Promise<Result> {
        return new Promise((resolve, reject) => {
            let result: Result = null;
            if (!givenresult) {
                return reject('No Result');
            } else {
                let s: any = {};
                for (const key in givenresult) {
                    s[key] = givenresult[key];
                }
                result = new Result(s);
                return resolve(result);
            }
        });
    }
    public close() {
        if (this.pool != null) {
            this.pool.end();
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

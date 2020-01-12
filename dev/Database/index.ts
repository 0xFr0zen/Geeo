import * as path from 'path';
import * as mysql from 'mysql';
import Options from './Options';

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
    private static MYSQL_PORT: number = 3306;
    private static pool: mysql.Pool = null;
    private port: number = Database.MYSQL_PORT;
    private username: string = '';
    private pwd: string = '';
    private dboptions: mysql.PoolConfig;
    constructor() {
        if (Database.pool == null) {
            let options: Options.IDatabase = {
                username: 'root',
                password: '',
            };
            this.port = Database.MYSQL_PORT!;
            this.pwd = options.password;
            this.username = options.username;
            this.dboptions = {
                insecureAuth: false,
                multipleStatements: true,
                localAddress: '127.0.0.1',
                connectTimeout: 60000,
                user: this.username,
                password: this.pwd,
                port: this.port,
                database: 'geeo',
                connectionLimit: 10,
                waitForConnections: true,
                queueLimit: 5,
            };
            Database.pool = mysql.createPool(this.dboptions);

            Database.pool.on('error', error => {
                console.error(error);
            });

            Database.pool.on('enqueue', () => {
                console.log('Waiting for available connection slot');
            });

            Database.pool.on('acquire', connection => {
                console.log('Connection %d acquired', connection.threadId);
            });

            Database.pool.on('connection', connection => {
                console.log('Connection %d connected', connection.threadId);
            });
            Database.pool.on('release', connection => {
                console.log('Connection %d released', connection.threadId);
            });
        }
    }
    public query(string: string, values?: any[]): Promise<Result[]> {
        return new Promise(async (resolve, reject) => {
            let retresults: Result[] = [];
            if (Database.pool != null) {
                try {
                    let myerror = null;
                    let connection: mysql.PoolConnection = await this.getConnection();
                    if (values) {
                        connection
                            .query(string, values)
                            .on('result', async (row, index) => {
                                let resultBox = await this.parseResult(row);
                                // console.log(resultBox);

                                retresults.push(resultBox);
                                resolve(retresults);
                            })
                            .on('error', error => {
                                myerror = error.message;
                            });
                    } else {
                        connection
                            .query(string)
                            .on('result', async (row, index) => {
                                let resultBox = await this.parseResult(row);
                                retresults.push(resultBox);
                                resolve(retresults);
                            })
                            .on('error', error => {
                                myerror = error.message;
                            });
                    }

                    connection.release();
                    if (myerror != null) {
                        reject(myerror || 'No Results');
                    }
                } catch (e) {
                    reject(e);
                }
            } else {
                reject('no connection');
            }
        });
    }
    private getConnection(): Promise<mysql.PoolConnection> {
        return new Promise((resolve, reject) => {
            Database.pool.getConnection((err, connection) => {
                if (err) reject(err.message);
                if (connection != null) {
                    resolve(connection);
                } else {
                    reject('No connection!');
                }
            });
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
        if (Database.pool != null) {
            Database.pool.end();
        }
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

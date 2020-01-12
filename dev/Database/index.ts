import * as path from 'path';
import * as mysql from 'mysql';
import Options from './Options';
import * as dotenv from 'dotenv';

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
    private static idleChecker: NodeJS.Timeout;
    private static lastQueried: number;
    private static deltas: any[] = [];
    private static idleCounter: number = 1;
    private static avgLatency: number = 0;
    constructor() {
        if (Database.pool == null) {
            console.log(
                Database.avgLatency != 0 ? 'Reopening pool.' : 'Opening pool.'
            );

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
                connectTimeout: 700,
                user: this.username,
                password: this.pwd,
                port: this.port,
                database: 'geeo',
                connectionLimit: 20,
                waitForConnections: true,
                queueLimit: 10,
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
            Database.idleChecker = setInterval(() => {
                if (Database.lastQueried) {
                    let delta = (Date.now() - Database.lastQueried) % 1000;
                    Database.deltas.push(delta);
                    let sumDeltas = 0;
                    Database.deltas.forEach(d => {
                        sumDeltas += d;
                    });

                    Database.avgLatency = Math.floor(
                        sumDeltas / Database.idleCounter
                    );
                    if (
                        delta >= Database.avgLatency &&
                        Database.idleCounter >= 10
                    ) {
                        console.log('Closing pool.');
                        Database.pool.end();
                        Database.pool = null;
                        Database.idleCounter = 1;
                        clearInterval(Database.idleChecker);
                        console.log('Closed pool');
                    }
                    Database.idleCounter++;
                }
            }, parseInt(dotenv.config().parsed.DB_IDLE_TIMER!) * 1000);
        } else {
            console.log('Already has pool.');
        }
    }
    public query(syntax: string, values?: any[]): Promise<Result[]> {
        return new Promise(async (resolve, reject) => {
            Database.lastQueried = Date.now();
            let retresults: Result[] = [];
            if (await this.isValidQuery(syntax, values)) {
                if (Database.pool != null) {
                    try {
                        let myerror = null;
                        let connection: mysql.PoolConnection = await this.getConnection();
                        if (values) {
                            let q = connection
                                .query(syntax, values)
                                .on('result', async (row, index) => {
                                    let resultBox = await this.parseResult(row);
                                    retresults.push(resultBox);
                                    resolve(retresults);
                                })
                                .on('error', error => {
                                    myerror = error.message;
                                });
                            console.log(q.sql);
                        } else {
                            connection
                                .query(syntax)
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
            } else {
                reject('Bad Query, Check syntax (missing values)');
            }
        });
    }
    public format(obj: any): Promise<string> {
        return new Promise((resolve, reject) => {
            let result = '';
            for (const key in obj) {
                let val: any = obj[key];
                if (typeof val === 'string' && val.includes('%')) {
                    result += `\`${key}\` LIKE ${mysql.escape(val)} AND `;
                } else {
                    result += `\`${key}\`=${mysql.escape(val)} AND `;
                }
            }
            result = result.substr(0, result.length - 5);
            resolve(result);
        });
    }
    private isValidQuery(syntax: string, values?: any[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (syntax.length == 0) {
                return reject('Query-Syntax is empty.');
            }
            if (!values) {
                return resolve(!syntax.includes('?'));
            } else {
                let placeholderAmount = syntax.split('?').length - 1;
                let valuesAmount = values.length;

                return resolve(placeholderAmount === valuesAmount);
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

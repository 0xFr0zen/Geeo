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
    private static cluster: mysql.PoolCluster = null;
    private static clusterCount: number = 0;
    private static idleChecker: NodeJS.Timeout;
    private static poolAmount = 10;
    private static lastQueried: number;
    private static deltas: any[] = [];
    private static idleCounter: number = 1;
    private static avgLatency: number = 0;
    private static db_life: number;
    private static dboptions: mysql.PoolConfig = {};
    constructor() {
        if (Database.cluster == null) {
            Database.deltas = [];
            // console.log(
            //     Database.avgLatency != 0 ? 'Reopening pool.' : 'Opening pool.'
            // );

            let options: Options.IDatabase = {
                username: 'root',
                password: '',
            };
            Database.dboptions = {
                insecureAuth: false,
                multipleStatements: true,
                localAddress: '127.0.0.1',
                connectTimeout: 5000,
                acquireTimeout: 5000,
                user: options.username,
                password: options.password,
                port: Database.MYSQL_PORT!,
                database: 'geeotest',
                connectionLimit: 20,
                waitForConnections: true,
                queueLimit: 10,
            };
            Database.cluster = mysql.createPoolCluster({
                restoreNodeTimeout: 10,
                removeNodeErrorCount: 10,
                canRetry: true,
            });
            for (let i = 0; i < Database.poolAmount; i++) {
                let poolname = Database.clusterCount++;
                let n = 'pool' + poolname;
                Database.cluster.add(Database.dboptions);
            }
            Database.db_life = Date.now();

            Database.cluster.on('error', error => {
                console.log('db-error', error);
                console.error(error);
            });

            Database.cluster.on('offline', e => {
                // console.log('Removed node: ', e);
            });
            console.log(
                'Updater set for: ' +
                    new Date(new Date().getTime() + 60000).toISOString()
            );
            // if (Database.idleChecker != null) {
            //     Database.idleChecker = setInterval(Database.updater, 30 * 1000);
            // }
        } else {
            // console.log('Already has pool.');
        }
    }
    private static async updater() {
        if (Database.lastQueried && Database.cluster) {
            let delta = (Date.now() - Database.lastQueried) % 1000;
            if (Database.deltas.length >= 10) {
                Database.deltas.shift();
            }
            Database.deltas.push(delta);

            let sumDeltas = 0;
            Database.deltas.forEach(d => {
                sumDeltas += d;
            });

            Database.avgLatency = Math.floor(sumDeltas / Database.idleCounter);
            if (delta >= this.avgLatency) {
                Database.cluster.end(err => {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Cluster closed');
                });
                Database.cluster = null;
                Database.idleCounter = 1;

                clearInterval(Database.idleChecker);
            }

            console.log('Database lifetime: ' + (await Database.lifetime()));
            Database.idleCounter++;
        }
        console.log(
            'Next Updater set for: ' +
                new Date(new Date().getTime() + 30000).toISOString()
        );
    }
    private static lifetime(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (Database.db_life == null) {
                return reject('No entity');
            }
            let ms = Date.now() - Database.db_life;
            let secs = Math.floor((ms / 1000) % 1000);
            let minutes = Math.floor((ms / 1000 / 1000) % 60);
            let hours = Math.floor((ms / 1000 / 1000 / 60) % 60);
            let days = Math.floor((ms / 1000 / 1000 / 60 / 60) % 24);
            let months = Math.floor((ms / 1000 / 1000 / 60 / 60 / 24) % 28);
            let result: string[] = [];
            result.push(
                months + 'M',
                days + 'd',
                hours + 'h',
                minutes + 'm',
                secs + 's'
            );
            return resolve(result.join(':'));
        });
    }
    public query(syntax: string, values?: any[]): Promise<Result[]> {
        return new Promise((resolve, reject) => {
            Database.lastQueried = Date.now();
            console.log('Last Queried: ' + new Date().toISOString());
            let retresults: Result[] = [];
            this.isValidQuery(syntax, values).then(goodQuery => {
                if (goodQuery) {
                    if (Database.cluster != null) {
                        try {
                            let myerror: any = null;
                            this.getConnection()
                                .then((connection: mysql.PoolConnection) => {                                    
                                    if (values) {
                                        console.log('with values')
                                        let c_q:mysql.Query = connection
                                            .query(syntax, values)
                                            .on('result', (row, index) => {
                                                console.log('row', row);

                                                this.parseResult(row)
                                                    .then(resultBox => {
                                                        retresults.push(
                                                            resultBox
                                                        );
                                                        resolve(retresults);
                                                    })
                                                    .catch(e => {
                                                        reject(e);
                                                    });
                                            })
                                            .on('packet', (packet) => {
                                                console.log('packet', packet);

                                            })
                                            .on(
                                                'error',
                                                (error: mysql.MysqlError) => {
                                                    console.log(error);

                                                    myerror = error.sqlMessage;
                                                }
                                            );
                                        console.log(c_q.sql);
                                    } else {
                                        let c_q = connection
                                            .query(syntax)
                                            .on('result', (row, index) => {
                                                this.parseResult(row)
                                                    .then(resultBox => {
                                                        retresults.push(
                                                            resultBox
                                                        );
                                                        resolve(retresults);
                                                    })
                                                    .catch(e => {
                                                        reject(e);
                                                    });
                                            })
                                            .on(
                                                'error',
                                                (error: mysql.MysqlError) => {
                                                    console.log(error);
                                                    myerror = error.sqlMessage;
                                                }
                                            );
                                        console.log(c_q.sql);
                                    }

                                    connection.release();

                                    if (myerror != null) {
                                        throw myerror;
                                    }
                                })
                                .catch(e => {
                                    throw e;
                                });
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
            let pool = Database.cluster.of('*');
            if (pool != null) {
                pool.getConnection((err, connection) => {
                    if (err) {
                        console.error(err);
                        reject(err.message);
                    }
                    if (connection != null) {
                        resolve(connection);
                    } else {
                        console.error('No connection!');

                        reject('No connection!');
                    }
                });
            } else {
                console.error('No pool found!');
                reject('No pool found!');
            }
        });
    }
    private parseResult(givenresult: any): Promise<Result> {
        return new Promise((resolve, reject) => {
            let result: Result = null;
            if (!givenresult) {
                return reject('No Result');
            } else {
                console.log(givenresult);

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
        if (Database.cluster != null) {
            Database.cluster.end();
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

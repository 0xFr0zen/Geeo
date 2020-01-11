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
                console.error(error);
            });

            this.pool.on('enqueue', () => {
                console.log('Waiting for available connection slot');
            });

            this.pool.on('acquire', connection => {
                console.log('Connection %d acquired', connection.threadId);
            });

            this.pool.on('connection', connection => {
                console.log('Connection %d connected', connection.threadId);
            });
            this.pool.on('release', connection => {
                console.log('Connection %d released', connection.threadId);
            });
        }
    }
    public query(string: string, values?: any[]): Promise<Result[]> {
        return new Promise(async (resolve, reject) => {
            let retresults: Result[] = [];
            if (this.pool != null) {
                try {
                    let myerror = null;
                    let connection: mysql.PoolConnection = await this.getConnection();
                    if (values) {
                        connection
                            .query(string, values)
                            .on('result', async (row, index) => {
                                connection.release();
                                
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
                                connection.release();
                                let resultBox = await this.parseResult(row);
                                retresults.push(resultBox);
                                resolve(retresults);
                            })
                            .on('error', error => {
                                myerror = error.message;
                            });
                    }if (myerror != null) {
                        console.log('irgendwelche errors? => ', myerror);
                        reject(myerror || 'No Results');
                    }else {
                        console.log("kein plan digga");
                        
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
            this.pool.getConnection((err, connection) => {
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
        if (this.pool != null) {
            this.pool.end();
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

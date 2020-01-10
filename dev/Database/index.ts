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
        return new Promise(async (resolve, reject) => {
            let retresults: Result[] = [];
            if (this.connection != null) {
                try {
                    if (values) {
                        let reeees: Result = null;
                        this.connection
                            .query(string, values)
                            .on('result', async (row, index) => {
                                // console.log('result', row, index);
                                let s = await this.parseResult(row);
                                reeees = s;
                                retresults.push(s);
                                return resolve(retresults);
                            })
                            .on('error', error => {
                                return reject(error);
                            })
                            .on('end', () => {
                                if (reeees == null) {
                                    return reject('No result');
                                }
                            });
                    } else {
                        let reeees: Result = null;
                        this.connection
                            .query(string)
                            .on('result', async (row, index) => {
                                // console.log('result', row, index);
                                let s = await this.parseResult(row);
                                reeees = s;
                                retresults.push(s);
                                return resolve(retresults);
                            })
                            .on('error', error => {
                                return reject(error);
                            })
                            .on('end', () => {
                                if (reeees == null) {
                                    return reject('No result');
                                }
                            });
                    }
                } catch (e) {
                    return reject(e);
                }
            } else {
                return reject('no connection');
            }
        });
    }
    
    private parseResult(givenresult: any): Promise<Result> {
        console.log(givenresult);

        return new Promise((resolve, reject) => {
            if (givenresult.length == 0) {
                reject([]);
            }
            let result: Result = null;
            if (!givenresult) {
                resolve(new Result(givenresult));
            } else {
                for (const key in givenresult) {
                    let colnames: string[] = Object.keys(givenresult[key]);
                    if (colnames.length > 0) {
                        let s: any = {};
                        colnames.forEach(col => {
                            s[col] = givenresult[key][col];
                        });
                        result = new Result(s);
                    } else {
                        result = new Result(true);
                    }
                }
                resolve(result);
            }
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

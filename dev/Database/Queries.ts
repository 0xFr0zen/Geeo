export default class Queries {
    static readonly USER: any = {
        CREATE: 'INSERT INTO users(username, pass, firstname, lastname, email, created) VALUES(?, ?, ?, ?, ?, ?);',
        FIND_EXACT: 'SELECT * FROM users WHERE ? = ?;',
        FIND_LIKE:'SELECT * FROM users WHERE ? LIKE ?;',
        REMOVE: '' ,
        VERIFY: '' ,
    };
    static readonly STORAGE = {};
    static readonly DOCUMENTS = {};
}

export interface PreparedQuery {
    query:string;
    values?:any[];
}

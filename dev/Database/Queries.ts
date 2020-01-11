export default class Queries {
    static readonly USER: any = {
        CREATE: 'INSERT INTO users(username, pass, firstname, lastname, email, created) VALUES(?, ?, ?, ?, ?, ?);',
        FIND_EXACT: 'SELECT username,firstname, lastname, email, userid FROM users WHERE username = ? LIMIT 1;',
        FIND_LIKE:'SELECT username,firstname, lastname, email, userid FROM users WHERE username LIKE ?;',
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

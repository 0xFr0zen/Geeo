namespace Queries {
    export enum USER {
        CREATE = 'INSERT INTO users(username, pass, firstname, lastname, email, created) VALUES(?, ?, ?, ?, ?, ?);',
        FIND_EXACT = 'SELECT username,firstname, lastname, email, userid FROM users WHERE username = ? LIMIT 1;',
        FIND_EXACT_MULTIPLE = 'SELECT username,firstname, lastname, email, userid FROM users WHERE ? LIMIT 1;',
        FIND_LIKE = 'SELECT username,firstname, lastname, email, userid FROM users WHERE username LIKE ?;',
        REMOVE = 'DELETE FROM users WHERE username = ?;',
        VERIFY = '',
    }
    export enum DATABASES {
        SHOW = 'SHOW DATABASES;',
    }
    export enum INIT {
        TABLES = '',
        TRIGGERS = '',
    }
    export enum STORAGE {}
    export enum DOCUMENTS {}
}
export default Queries;
export interface PreparedQuery {
    query: string;
    values?: any[];
}

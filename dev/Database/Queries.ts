namespace Queries {
    export enum USER {
        /**
         * creating user (username, password, firstname, lastname, email and current date required)
         */
        CREATE = 'INSERT INTO users(username, pass, firstname, lastname, email, created) VALUES(?, ?, ?, ?, ?, ?);',

        /**
         * Looks for the exact match of the username.
         */
        FIND_EXACT = 'SELECT username,firstname, lastname, email, userid FROM users WHERE username = ? LIMIT 1;',

        /**
         * Looks for multiple users, via filter, lists them up.
         */
        FIND_MULTIPLE = 'SELECT username,firstname, lastname, email, userid FROM users WHERE ?;',

        /**
         * Looks for multiple users via username-filter, list them up.
         */
        FIND_LIKE = 'SELECT username,firstname, lastname, email, userid FROM users WHERE username LIKE ?;',

        /**
         *  removes user.
         */
        REMOVE = 'DELETE FROM users WHERE username = ?;',

        /**
         * verifies user via email-token.
         */
        VERIFY = '',
    }
    export enum DATABASES {
        SHOW = 'SHOW DATABASES;',
    }
    export enum INIT {
        TABLES = '',
        TRIGGERS = '',
    }
    export enum STORAGE {
        LOAD = 'SELECT safe.safeID as safeid, safe.safetype as safetype, safe.safename as safename, safe.safeinventoryID as safeinventoryID, user.username as username FROM user INNER JOIN safe on safe.safeid = user.userid WHERE user.userID = ?',
        ADD =  'INSERT INTRO safe(safetype, safename, )',
    }
    export enum DOCUMENTS {}
}
export default Queries;
export interface PreparedQuery {
    query: string;
    values?: any[];
}

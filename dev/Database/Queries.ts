export class Queries {
    static readonly USER:IQuery = {
        CREATE:{syntax:"INSERT INTO users(username, pass, firstname, lastname, email, created) VALUES(?,?,?,?,?,?);", params:6},
        FIND:{syntax:"", params:1},
        REMOVE:{syntax:"", params:2},
        VERIFY:{syntax:"", params:1},

    };
    static readonly STORAGE = {};
    static readonly DOCUMENTS = {};
}
interface IQuery {
    [key:string]:QueryBox;
}
interface QueryBox {
    syntax:string;
    params:number;
}

export interface PreparedQuery {
    query:QueryBox;
    values?:any[];
}
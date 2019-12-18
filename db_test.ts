import Database from './dev/Database/index';
let db = new Database();

let result = db.query(`SHOW DATABASES;`);
console.log(result);


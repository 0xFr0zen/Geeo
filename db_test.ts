import Database from './dev/System/Entity/Database/index';
let db = new Database({ port: 3306, username: 'root', password: 'root' });

let result = db.query(`SHOW DATABASES;`);
console.log(result);

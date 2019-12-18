import Database from './dev/Database/index';
let db = new Database();

let result = db.query(`use m104;select * from ?`,["ort"]);
console.log(result);

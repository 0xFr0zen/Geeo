import Database from './dev/system/Entity/Database/index';
let db = new Database('SV', {
    username: 'root',
    password: '',
});
let q = `SELECT * FROM Student WHERE Fachrichtung = ?;`;
let v = ["BWL"];
db.query(q, v)
    .then(results => console.log(results))
    .catch(e => console.error(e))
    .finally(() => console.log(`query '${q}' done`));
db.close();

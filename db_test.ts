import Database from './dev/Database';
let db = new Database('SV', {
    username: 'root',
    password: '',
});
let q:string = ``;
let v:any[] = [];
db.query(q, v)
    .then(results => console.log(results))
    .catch(e => console.error(e))
    .finally(() => console.log(`query '${q}' done`));
db.close();

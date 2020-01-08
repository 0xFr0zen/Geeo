import Database from './dev/Database';
import { PreparedQuery, Queries } from './dev/Database/Queries';
let db = new Database('geeo');

let queries: PreparedQuery[] = [
    {
        query: Queries.USER.CREATE,
        values: [
            'testuser',
            'testpassword',
            'Max',
            'Mustermann',
            "test@user.com",
            `CURRENT_TIMESTAND()`,
        ],
    },
];

for (const queryKey in queries) {

    let pQ = queries[queryKey];
    console.log(pQ)
    let pQQ = pQ.query.syntax;
    let pQP = pQ.query.params;
    if(pQP == pQ.values.length){
        db.query(pQQ, pQ.values)
        .then(results => console.log(results))
        .catch(e => console.error(e))
        .finally(() => console.log(`query '${pQQ}' done`));
    }
    
}
db.close();

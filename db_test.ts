import Database from './dev/Database';
import Queries, { PreparedQuery } from './dev/Database/Queries';
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

    let pQ:PreparedQuery = queries[queryKey];
    let pQQB = pQ.query;
    let countedParams = (pQQB.split("?").length - 1);
    if(countedParams === pQ.values.length){
        db.query(pQQB, pQ.values)
        .then(results => console.log(results))
        .catch(e => console.error(e))
        .finally(() => console.log(`query '${pQQB}' done`));
    }
    
}
db.close();

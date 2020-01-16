import fs from 'fs';
import * as path from 'path';
import Database from './index';
import { Result } from './index';
import Queries from './Queries';
namespace Initializer {
    export function initialize(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let db = new Database();
            let sql_path = path.join(
                process.cwd(),
                './config/db/geeo_init_db.sql'
            );
            if (!fs.existsSync(sql_path)) {
                return reject('Initilization failed, no SQL-File.');
            }
            let s = fs.readFileSync(sql_path).toString();
            let x = 0;
            db.query(s)
                .then(async (results: Result[]) => {
                    x = results.length;
                    let d = await db.query(Queries.USER.CREATE, ["admin","admin", "oezguer", "isbert", "frozennetwork1996@gmail.com", new Date()]);
                    console.log(d);

                })
                .catch(e => console.error(e));
            db.close();
            return resolve(x);
        });
    }
}

export default Initializer;

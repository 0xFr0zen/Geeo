import fs from 'fs';
import * as path from 'path';
import Database from './index';
import { Result } from './index';
import Queries from './Queries';
import * as mysql from 'mysql';
namespace Initializer {
    export function initialize(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let db2 = new Database();
            let sql_path = path.join(
                process.cwd(),
                './config/db/geeo_init_db.sql'
            );
            if (!fs.existsSync(sql_path)) {
                return reject(-1);
            }
            let s = fs.readFileSync(sql_path).toString();
            let x = 0;
            let connection = mysql.createConnection({
                host: 'localhost',
                port: 3306,
                insecureAuth: true,
                multipleStatements: true,
                user:'root',
                password:''
            });
            connection.query(s, (err, results)=>{
                if(err) return console.error(err);
                // console.log(results);
                
            });
            connection.end();
            db2.query(Queries.USER.CREATE, [
                'admin',
                'admin',
                'oezguer',
                'isbert',
                'frozennetwork1996@gmail.com',
                new Date(),
            ])
                .then(res => {
                    console.log('admin added.');

                    db2.close();
                })
                .catch(ce => reject(ce));
            return resolve(x);
        });
    }
}

export default Initializer;

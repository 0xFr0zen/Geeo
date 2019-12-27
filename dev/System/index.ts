import Device from '../Device';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
function initialize(env:any) {
    env = env.parsed;
    let d: Device = new Device();
    let adminIdent = d.createIdentity(env.ADMIN_USERNAME);
    if (adminIdent != null) {
        let rootpath = path.join(process.cwd());
        console.log(rootpath);
        
        let paths: any = {
            device: path.join(rootpath, 'saved/device/'),
            entities: path.join(rootpath, 'saved/entities/users/'),
        };

        for (let key in paths) {
            let folder = paths[key];
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
            }
        }
    } else {
        throw new Error('Admin couldnt be created');
    }
}

initialize(dotenv.config());
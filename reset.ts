import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
if (dotenv.config().parsed.mode === 'debug') {
    reset();
}
export function reset() {
    let result = false;
    //reset
    let rootpath = path.join(process.cwd(), './');
    let paths: any = {
        device: path.join(rootpath, 'saved/device/'),
        entities: path.join(rootpath, 'saved/entities/users/'),
    };

    for (let key in paths) {
        let folder = paths[key];
        if (fs.existsSync(folder)) {
            emptyFolder(folder, true);
        }
        // fs.mkdirSync(folder);
    }

    console.log('Resetted all.');
}
function emptyFolder(p: string, alsoremoveFolder = false) {
    let files = fs.readdirSync(p);

    files.forEach(value => {
        let file = path.join(p, value);
        if (fs.statSync(file).isDirectory()) {
            emptyFolder(file, true);
        } else {
            fs.unlinkSync(file);
        }
    });
    if (alsoremoveFolder) {
        fs.rmdirSync(p);
    }
}

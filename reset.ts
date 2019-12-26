import * as path from 'path';
import * as fs from 'fs';

(() => {
    //reset
    let rootpath = path.join(path.dirname(require.main.filename), '../');
    let paths: any = {
        device: path.join(rootpath, 'saved/device/'),
        entities: path.join(rootpath, 'saved/entities/users/'),
    };

    for (let key in paths) {
        let folder = paths[key];
        emptyFolder(folder);
    }
    console.log("Resetted all.");
    
})();
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

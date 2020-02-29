import * as fs from 'fs';
import * as path from 'path';
let testfolder = path.join(process.cwd(), '/tests/');
let files = fs.readdirSync(testfolder).filter((v, i) => {
    return !v.match('index.ts');
});
files.forEach((v, i) => {
    console.log(v);
    import 
});

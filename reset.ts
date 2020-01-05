import * as path from 'path';
import * as fs from 'fs';
import * as del from 'del';

export async function reset(): Promise<string[]> {
    //reset
    let rootpath = process.cwd();
    return del([path.join(rootpath, 'saved/')]);
}

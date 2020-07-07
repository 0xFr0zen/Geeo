import path from 'path';
import del from 'del';

export async function reset(): Promise<string[]> {
    //reset
    let rootpath = process.cwd();
    return del([path.join(rootpath, 'saved/')]);
}

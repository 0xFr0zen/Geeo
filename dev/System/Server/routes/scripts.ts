import express from 'express';
import * as path from 'path';
import * as fs from 'fs';

namespace scripts {
    export function load(req: express.Request, res: express.Response) {
        let p = path.join(
            process.cwd(),
            './dev/System/Server/Web/Scripts/',
            req.params.file
        );
        res.setHeader('Content-Type', 'application/javascript');

        if (fs.existsSync(p)) {
            res.sendFile(p);
        } else {
            res.status(404);
            res.send(`File '${p}' not found`);
        }
    }
}
export default scripts;

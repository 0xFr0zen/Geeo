import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
namespace fonts {
    export function load(req: express.Request, res: express.Response) {
        let p = path.join(
            process.cwd(),
            './dev/System/Server/Web/Fonts/',
            req.params.file
        );
        res.setHeader('Content-Type', 'text/css');

        if (fs.existsSync(p)) {
            res.sendFile(p);
        } else {
            res.status(404);
            res.send(`File '${p}' not found`);
        }
    }
}
export default fonts;

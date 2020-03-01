import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
namespace themes {
    export function get() {
        return [
            '/themes/:file',
            (req: express.Request, res: express.Response) => {
                let p = path.join(
                    process.cwd(),
                    './dev/System/Server/Web/Themes/',
                    req.params.file
                );
                res.setHeader('Content-Type', 'text/css');

                if (fs.existsSync(p)) {
                    res.sendFile(p);
                } else {
                    res.status(404);
                    res.send(`File '${p}' not found`);
                }
            },
        ];
    }
}
export default themes;
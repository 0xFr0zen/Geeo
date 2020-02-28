import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
namespace images {
    export function get() {
        return [
            '/images/:file',
            (req: express.Request, res: express.Response) => {
                let file = req.params.file.split('/');
                let p = '';
                if (file.length == 2) {
                    let type = file[0];
                    let fname = file[1];
                    p = path.join(
                        process.cwd(),
                        './dev/System/Server/Web/Images/',
                        type,
                        fname
                    );
                } else {
                    let type = file[0];
                    let fname = file[1];
                    p = path.join(
                        process.cwd(),
                        './dev/system/Server/Web/Images/default/',
                        req.params.file
                    );
                }

                res.setHeader('Content-Type', 'application/javascript');

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
export default images;

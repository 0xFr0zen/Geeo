import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
namespace themes {
    export function get() {
        let error = '';
        return [
            '/themes(/:file(*))?',
            (req: express.Request, res: express.Response) => {
                res.setHeader('Content-Type', 'text/css');
                if (req.params.file) {
                    let filen = req.params.file;
                    if (filen.split(',').length >= 1) {
                        let preparedString = '';
                        let files = filen.split(',');
                        files.forEach((f) => {
                            if (!f.endsWith('.css')) {
                                f = f.concat('.css');
                            }
                            let p = path.join(
                                process.cwd(),
                                './dev/System/Web/Themes/',
                                f
                            );

                            if (fs.existsSync(p)) {
                                preparedString += fs
                                    .readFileSync(p)
                                    .toString()
                                    .concat('\n');
                            } else {
                                error = `${p} doesnt exist`;
                            }
                        });
                        if (error.length === 0) {
                            return res.send(preparedString);
                        } else {
                            return res
                                .status(404)
                                .send(`File not found. Error: ${error}`);
                        }
                    } else {
                        let preparedString = '';
                        if (filen.length == 0) {
                            let files2 = ['main.css'];
                            files2.forEach((f2) => {
                                let p2 = path.join(
                                    process.cwd(),
                                    './dev/System/Web/Themes/',
                                    f2
                                );

                                if (fs.existsSync(p2)) {
                                    preparedString += fs
                                        .readFileSync(p2)
                                        .toString()
                                        .concat('\n');
                                }
                            });
                        }

                        return res.send(preparedString);
                    }
                } else {
                    let preparedString = '';
                    let files2 = ['main.css'];
                    files2.forEach((f2) => {
                        let p2 = path.join(
                            process.cwd(),
                            './dev/System/Web/Themes/',
                            f2
                        );

                        if (fs.existsSync(p2)) {
                            preparedString += fs
                                .readFileSync(p2)
                                .toString()
                                .concat('\n');
                        }
                    });

                    return res.send(preparedString);
                }
            },
        ];
    }
}
export default themes;

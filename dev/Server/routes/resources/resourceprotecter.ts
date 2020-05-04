import express, { NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
namespace resourceprotecter {
    export function use() {
        return [
            '/:type(themes|scripts|images|fonts)/:file(*)',
            (
                req: express.Request,
                res: express.Response,
                next: NextFunction
            ) => {
                let p = path.join(
                    process.cwd(),
                    './dev/System/Web/',
                    req.params.type.toUpperCase()
                );
                let p2 = path.join(
                    process.cwd(),
                    './dev/System/Web/',
                    req.params.type.toUpperCase(),
                    req.params.file
                );
                let rel = path.relative(p, p2);
                if (rel.match(/\.\.(?:\\)?/g) != null) {
                    return res.status(403).send('Hey, what you looking for?');
                } else {
                    next();
                }
            },
        ];
    }
}
export default resourceprotecter;

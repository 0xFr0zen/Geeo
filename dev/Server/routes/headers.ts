import express from 'express';

namespace headers {
    export function load(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        res.setHeader(
            'Cache-Control',
            'must-revalidate'
        );
        // res.setHeader('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT');
        // res.setHeader('Pragma', 'no-cache');
        next();
    }
}
export default headers;

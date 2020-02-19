import express from 'express';

namespace cashier {
    export function get(req: express.Request, res: express.Response) {
        return res.render('index', {
            username: 'admin',
            safes: [],
        });
    }
}
export default cashier;

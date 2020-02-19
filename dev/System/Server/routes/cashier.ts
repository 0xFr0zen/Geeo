import express from 'express';

namespace indexsite {
    export function get() {
        return [
            '/cashier',
            (req: express.Request, res: express.Response) => {
                return res.render('index', {
                    username: 'admin',
                    safes: [],
                    loadContent: 'cashier',
                });
            },
        ];
    }
}
export default indexsite;

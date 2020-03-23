import express from 'express';
namespace cashieritem {
    export function get() {
        return [
            '/chashieritem',
            (req: express.Request, res: express.Response) => {
                return res.render('mods/item', {
                    type: req.query.type || '',
                    title: req.query.title || '',
                    info: req.query.info || undefined,
                    price: req.query.price || '0.00',
                });
            },
        ];
    }
}

export default cashieritem;

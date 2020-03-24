import express from 'express';
namespace cashieritem {
    export function get() {
        return [
            '/sections/:page',
            (req: express.Request, res: express.Response) => {
                return res.render('sections', {page:req.params.page});
            },
        ];
    }
}

export default cashieritem;

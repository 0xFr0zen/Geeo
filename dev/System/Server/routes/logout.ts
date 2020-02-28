import express from 'express';
namespace logout {
    export function get(req: express.Request, res: express.Response) {
        req.session.user = null;
        req.session.save(err => console.log(err));
        return res.redirect('/');
    }
}

export default logout;

import express from 'express';
namespace register {
    export function get(req: express.Request, res: express.Response) {
        return res.render('register');
    }
    export function post(req: express.Request, res: express.Response) {
        let q = req.query || req.body;
        console.log(q);
        
        return res.redirect('/');
    }
}
export default register;

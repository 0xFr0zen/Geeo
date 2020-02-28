import express from 'express';
namespace login {
    export function get(req: express.Request, res: express.Response) {
        let q = req.query || req.body;

        let { sid } = req.session;

        if (typeof q.forced !== 'undefined') {
            return res.render('login');
        }

        return res.render('login');
    }
    export function post(req: express.Request, res: express.Response) {
        let loginobj = req.query || req.body;
        let username = loginobj.username;
        let pwd = loginobj.password;

        try {
            let s = '';
            req.session.sid = { name: username };

            req.session.save(err => {
                if (err) console.error('save error =>', err);
                console.log(`cookie '${Object.keys(req.session)}' saved`);
            });

            return res.end(String(req.session.sid.name));
        } catch (e) {
            console.error(e);
            return res.redirect('/login');
        }
    }
}
export default login;

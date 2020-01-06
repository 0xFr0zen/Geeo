import express from 'express';
import url from 'url';
function RLogin() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.get('/', function(req: express.Request, res: express.Response) {
        let q = req.query || req.body;
        if (typeof q.forced !== 'undefined') {
            return res.render('login');
        }else if(!req.cookies.user){
            return res.render('login');
        }else if(req.cookies.user === 'empty'){
            console.log(req.cookies.user);
            return res.render('login');
        }
        
        return res.redirect('/');
    });
    return router;
}
export default RLogin();

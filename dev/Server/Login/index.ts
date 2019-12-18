import * as express from 'express';
import User from '../../User';
function LoginRouter() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.get('/$', function(req:express.Request, res:express.Response){
        res.render("login");
    });
    router.post('/$', function(req:express.Request, res:express.Response){
        let q = req.query;
        console.log();
        res.send("OK");
    });
    return router;
}
export default LoginRouter();
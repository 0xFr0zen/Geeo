import express from 'express';
import url from 'url';
function RLogin() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.get('/$', function(req: express.Request, res: express.Response) {
        res.render('login');
    });
    return router;
}
export default RLogin();

import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
function User() {
    let router: express.Router = express.Router();
    router.use('/:name', function(req: express.Request, res: express.Response) {
        res.render('user', { username: req.params.name });
    });
    router.use('/$', function(req: express.Request, res: express.Response) {
        res.redirect("/");
    });
    return router;
}
export default User;

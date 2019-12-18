import * as express from 'express';
function RIndex() {
    let router: express.Router = express.Router();
    router.use('/', function(req: express.Request, res: express.Response) {
        res.render('index', { loggedin: false });
    });
    return router;
}
export default RIndex();

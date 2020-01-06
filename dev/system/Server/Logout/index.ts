import express from 'express';
import url from 'url';
function RLogout() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.get('/', function(req: express.Request, res: express.Response) {
        res.redirect(
            url.format({
                pathname: "http://".concat(req.hostname.concat(':4000/auth/logout')),
                query: req.query || req.body,
            })
        );
    });
    return router;
}
export default RLogout();

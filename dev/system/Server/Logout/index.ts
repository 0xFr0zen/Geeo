import express from 'express';
import url from 'url';
function RLogout() {
    let router: express.Router = express.Router({ mergeParams: true });

    router.get('/', function(req: express.Request, res: express.Response) {
        res.clearCookie("user").redirect(
            url.format({
                pathname: 'http://'.concat(
                    req.hostname.concat('/auth/logout')
                ),
            })
        );
    });
    return router;
}
export default RLogout();

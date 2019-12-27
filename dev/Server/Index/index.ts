import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import RUser from '../User/';
import User from '../../Entity/User';
import Login from '../Login/';
import Logout from '../Logout';
import Identity from '../../Identity';
function RIndex() {
    let router: express.Router = express.Router({mergeParams:true});
    router.use('/$', function(req: express.Request, res: express.Response) {
        let user:User = User.from(Identity.of("oezguer"));
        if(!user.isLoggedIn()){
            res.redirect("/login");
            return;
        }else {
            res.render('index', { user: user});

        }
    });
    router.use('/user/', RUser);
    router.use('/login', Login);
    router.use('/logout', Logout);
    router.use('/themes/:file', function(
        req: express.Request,
        res: express.Response
    ) {
        let p = path.join(
            path.dirname(require.main.filename),
            './dev/Server/Web/Themes/',
            req.params.file
        );
        res.setHeader('Content-Type', 'text/css');

        if (fs.existsSync(p)) {
            res.sendFile(p);
        } else {
            res.status(404);
            res.send(`File '${p}' not found`);
        }
    });
    router.use('/scripts/:file', function(
        req: express.Request,
        res: express.Response
    ) {
        let p = path.join(
            path.dirname(require.main.filename),
            './dev/Server/Web/Scripts/',
            req.params.file
        );
        res.setHeader('Content-Type', 'application/javascript');

        if (fs.existsSync(p)) {
            res.sendFile(p);
        } else {
            res.status(404);
            res.send(`File '${p}' not found`);
        }
    });
    router.use('/images/:file(.*)', function(
        req: express.Request,
        res: express.Response
    ) {
        let file = req.params.file.split('/');
        let p = '';
        if (file.length == 2) {
            let type = file[0];
            let fname = file[1];
            p = path.join(
                path.dirname(require.main.filename),
                './dev/Server/Web/Images/',
                type,
                fname
            );
        } else {
            let type = file[0];
            let fname = file[1];
            p = path.join(
                path.dirname(require.main.filename),
                './dev/Server/Web/Images/default/',
                req.params.file
            );
        }

        res.setHeader('Content-Type', 'application/javascript');

        if (fs.existsSync(p)) {
            res.sendFile(p);
        } else {
            res.status(404);
            res.send(`File '${p}' not found`);
        }
    });
    return router;
}
export default RIndex();

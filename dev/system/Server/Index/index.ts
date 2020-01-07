import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import RUser from '../User/';
import User from '../../Entity/User';
import Login from '../Login/';
import Logout from '../Logout';
import Identity from '../../Identity';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
interface IUser {
    username:string;
}
function RIndex() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.use('/$', function(req: express.Request, res: express.Response) {
        let cookies = req.cookies;
        if(!cookies){
            console.log("Has no cookies!");
            return res.redirect('/login');
        }
        
        let token:string = cookies.user || null;
        if(!token){
            console.log("No token at all");
            console.log(cookies);
            
            return res.redirect('/login');
        }
        if(token === "empty"){
            console.log("empty cookie");
            return res.redirect('/login');

        }
        try {
            let de_token:any = jwt.verify(token, dotenv.config().parsed.SECRET!);
            if(!de_token){
                console.log("wrong token");
                
                return res.redirect('/login');
            }
            let usersname = de_token.name;
            if(usersname){

                let usersafes = User.from(Identity.of(usersname)).getSafes();
                return res.render('index', {username:usersname, safes: usersafes});
            }
            return res.status(404).send("Failed to find User");
        }catch(e){            
            console.error("failed", token, e);
            return res.redirect('/logout');
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
            process.cwd(),
            './dev/system/Server/Web/Themes/',
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
            process.cwd(),
            './dev/system/Server/Web/Scripts/',
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
                process.cwd(),
                './dev/system/Server/Web/Images/',
                type,
                fname
            );
        } else {
            let type = file[0];
            let fname = file[1];
            p = path.join(
                process.cwd(),
                './dev/system/Server/Web/Images/default/',
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

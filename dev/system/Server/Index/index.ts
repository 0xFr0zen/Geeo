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
import { createAccessToken } from '..';
import url from 'url';
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
        
        let token:any = cookies.user || null;
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
            let de_token:any = jwt.verify(token.at, dotenv.config().parsed.SECRET!);
            if(!de_token){
                console.log("wrong token");
                
                return res.redirect('/login');
            }
            console.log(de_token);

            let usersname = de_token.name;
            if(typeof usersname === 'string'){

                let usersafes = User.from(Identity.of(usersname)).getSafes();
                return res.render('index', {username:usersname, safes: usersafes});
            }else {
                return res.status(404).send({error:"this cookie is wrongly made"})
            }

            return res.status(404).send(`Failed to find User '${usersname}'`);
        }catch(e){            
            console.error("failed", token, e);
            return res.redirect('/logout');
        }
    });
    router.use(
        '/auth/',
        express
            .Router({ mergeParams: true })
            .post(
                '/login',
                async (req: express.Request, res: express.Response) => {
                    let loginobj = req.query || req.body;
                    let username = loginobj.username;
                    let pwd = loginobj.password;
                    try {
                        createAccessToken({ name: username })
                            .then(string => {
                                let c = { at: string };
                                console.log('made cookie', c);
                                let expDate =
                                    parseInt(
                                        dotenv.config().parsed
                                            .COOKIE_EXPIRATION!
                                    ) *
                                    60 *
                                    1000;
                                res.cookie('user', c, {
                                    maxAge: expDate,
                                    httpOnly: true,
                                });
                                return res.send({
                                    ok: true,
                                    expDate: expDate,
                                });
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    } catch (e) {
                        return res.send({ ok: false });
                    }
                }
            )
            .get(
                '/logout$',
                async (req: express.Request, res: express.Response) => {
                    res.clearCookie('user');
                    return res.redirect(
                        url.format({
                            pathname: 'http://'.concat(
                                req.hostname.concat('/')
                            ),
                            query: req.body,
                        })
                    );
                }
            )
    );
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

import express, { NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import System from '..';
import bodyParser = require('body-parser');
import fs from 'fs';
import session from 'express-session';
import url from 'url';
import jwt from 'jsonwebtoken';
import User from '../Entity/User';
import Safe from '../Entity/Safe';
import { GeeoMap } from '../GeeoMap';
import Database from '../../Database/index';

export default class Server {
    private static DEFAULT_PORT: number =
        parseInt(dotenv.config().parsed.DEFAULT_WEBSERVER_PORT) || 80;
    private static DEFAULT_HOSTNAME: string = 'geeo';
    private static DEFAULT_VIEW_ENGINE: string = 'vash';
    private router: express.Router = null;
    private application: express.Application = null;
    private listen: import('http').Server = null;
    private system: System = null;
    private DB:Database = null;
    constructor(system: System) {
        this.system = system;
        this.DB = new Database('geeo', {username:'root', password:''});
        this.application = express();
        this.application.set('trust proxy', 1);
        this.application.use(
            session({
                name: 'sid',
                resave: true,
                saveUninitialized: true,
                secret: dotenv.config().parsed.SECRET!,
                cookie: {
                    maxAge:
                        parseInt(dotenv.config().parsed.COOKIE_EXPIRATION!) *
                        60000,
                    sameSite: true,
                    secure: false,
                },
            })
        );
        this.application.use(bodyParser.urlencoded({ extended: false }));
        this.router = express.Router({ mergeParams: true });

        let view_engine =
            dotenv.config().parsed.webrenderer || Server.DEFAULT_VIEW_ENGINE;
        this.application.set('view engine', view_engine);

        this.application.set(
            'views',
            path.join(
                process.cwd(),
                `./dev/System/Server/Web/Templates/${view_engine}/`
            )
        );
        this.router
            .get('/$', function(req: express.Request, res: express.Response) {
                let { sid } = req.session;
                if (!sid) {
                    console.log(sid);

                    return res.redirect('/login');
                }
                try {
                    let de_token: any = jwt.verify(
                        sid,
                        dotenv.config().parsed.SECRET!
                    );
                    if (!de_token) {
                        console.log('wrong token');

                        return res.redirect('/login');
                    }
                    console.log(de_token);

                    let usersname = de_token.name;
                    if (typeof usersname === 'string') {
                        let usersafes: any[] = [];
                        return res.render('index', {
                            username: usersname,
                            safes: usersafes,
                        });
                    } else {
                        return res
                            .status(404)
                            .send({ error: 'this cookie is wrongly made' });
                    }
                } catch (e) {
                    console.error('failed', sid, e);
                    return res.redirect('/logout');
                }
            })
            .get('/login$', function(
                req: express.Request,
                res: express.Response
            ) {
                let q = req.query || req.body;

                let { sid } = req.session;

                if (typeof q.forced !== 'undefined') {
                    return res.render('login');
                } else if (!sid) {
                    console.log("No 'user' cookie set", sid);
                    return res.render('login');
                }

                return res.redirect('/');
            })
            .post('/login$', (req: express.Request, res: express.Response) => {
                let loginobj = req.query || req.body;
                let username = loginobj.username;
                let pwd = loginobj.password;

                try {
                    let s = '';
                    req.session.sid = { name: username };

                    req.session.save(err => {
                        if (err) console.error('save error =>', err);
                        console.log(
                            `cookie '${Object.keys(req.session)}' saved`
                        );
                    });

                    return res.end(String(req.session.sid.name));
                } catch (e) {
                    console.error(e);
                    return res.redirect('/login');
                }
            })
            .get('/logout$', (req: express.Request, res: express.Response) => {
                req.session.user = null;
                req.session.save(err => console.log(err));
                return res.redirect('/');
            })
            .use('/user/:name/', function(
                req: express.Request,
                res: express.Response
            ) {
                res.render('user', { username: req.params.name });
            })
            .use('/user/:name/storages$', async (
                req: express.Request,
                res: express.Response
            ) => {
                
                let name = req.params.name;
                let user = User.bind(User.find,name, this.DB);

                let showcase_safes: any[] = [];
                if (user != null) {
                    let safes = user.getSafes();

                    safes.forEach(async (safe:Safe) => {
                        if (safe.getLastLoaded() != null) {
                            let storage: IStorage = {
                                name: safe.getName(),
                                created: await safe.getCreated(),
                                last_loaded: await safe.getLastLoaded(),
                                space: await safe.getSpace(),
                            };
                            showcase_safes.push(storage);
                        }
                    });
                }

                res.json(showcase_safes);
            })
            .use('/user/:name/storage/:invname', function(
                req: express.Request,
                res: express.Response
            ) {
                let name = req.params.name;
                let invname = req.params.invname;
                let user = User.bind(User.find,name, this.DB);

                let result: Safe = null;
                if (user != null) {
                    let safes = user.getSafes();
                    safes.find((safe: Safe) => {
                        return safe.getName() === invname;
                    });
                    result = safes[0];
                }
                if (result != null) {
                    res.json(JSON.parse(result.toString()).safe);
                } else {
                    res.status(404).send(`Storage '${name}' not found`);
                }
            })
            .post('/user/:name/storages/:operation/:invname', function(
                req: express.Request,
                res: express.Response
            ) {
                let user: User = null;
                let result: boolean = false;
                let name: string = req.params.name;
                let invname: string = req.params.invname;

                user = undefined

                if (user != null) {
                    switch (req.params.operation) {
                        case 'add':
                            user.addSafe(invname);

                            break;
                        case 'remove':
                            user.removeSafe(invname);
                            break;
                        case 'edit':
                            let safe: Safe = user.getSafe(invname);
                            break;

                        default:
                            break;
                    }
                }
                res.json({ added: result });
            })
            .use('/themes/:file', function(
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
            })
            .use('/scripts/:file', function(
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
            })
            .use('/images/:file(.*)', function(
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
        this.application.use(this.router);
        this.start();
    }
    public start(): void {
        if (this.application) {
            let port = Server.DEFAULT_PORT;
            this.listen = this.application.listen(port, () => {
                this.system.emit('ready', port);
            });
        }
    }
}

export async function createAccessToken(obj: any): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            let string = jwt.sign(obj, dotenv.config().parsed.SECRET!, {
                expiresIn: dotenv.config().parsed.COOKIE_EXPIRATION! + 'm',
            });
            if (string && string.length > 0) {
                resolve(string);
            }
        } catch (e) {
            reject(new Error('couldnt create '));
        }
    });
}
export async function createRefreshToken(obj: any) {
    return createAccessToken(obj);
}

interface IStorage {
    name: string;
    created: Date;
    space: GeeoMap<string, any>;
    last_loaded: Date;
}

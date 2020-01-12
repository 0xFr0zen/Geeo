import express, { NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import System from '..';
import bodyParser = require('body-parser');
import session from 'express-session';
import jwt from 'jsonwebtoken';
import Database from '../../Database/index';
import login from './routes/login';
import logout from './routes/logout';
import user from './routes/user';
import themes from './routes/themes';
import scripts from './routes/scripts';
import images from './routes/images';

export default class Server {
    private static DEFAULT_PORT: number =
        parseInt(dotenv.config().parsed.DEFAULT_WEBSERVER_PORT) || 80;
    private static DEFAULT_HOSTNAME: string = 'geeo';
    private static DEFAULT_VIEW_ENGINE: string = 'vash';
    private router: express.Router = null;
    private application: express.Application = null;
    private listen: import('http').Server = null;
    private system: System = null;
    constructor(system: System) {
        this.system = system;
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
            .get('/login$', login.get)
            .post('/login$', login.post)
            .get('/logout$', logout.get)
            .use('/user/:name/$', user.profile)
            .use('/user/:name/storages/$', user.storages)
            .use('/user/:name/storage/:invname/$', user.storage)
            .post('/user/:name/storages/:operation/:invname/$', user.operate)
            .use('/themes/:file/$', themes.load)
            .use('/scripts/:file/$', scripts.load)
            .use('/images/:file(.*)$', images.load);
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

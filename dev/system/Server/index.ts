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
import register from './routes/register';
import fonts from './routes/fonts';
import headers from './routes/headers';
import indexsite from './routes/indexsite';

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
        this.application.use(bodyParser.json());
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
            .use(headers.load)
            .get('/$', indexsite.get)
            .get('/login$', login.get)
            .post('/login$', login.post)
            .get('/logout$', logout.get)
            .get('/register$', register.get)
            .post('/register$', register.post)
            .use('/user/:name$', user.profile)
            .use('/user/:name/storages', user.storages)
            .use('/user/:name/storage/:invname', user.storage)
            .post('/user/:name/storages/:operation/:invname', user.operate)
            .use('/themes/:file', themes.load)
            .use('/fonts/:file', fonts.load)
            .use('/scripts/:file', scripts.load)
            .use('/images/:file(.*)', images.load);
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

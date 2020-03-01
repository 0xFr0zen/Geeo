import express, { NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import System from '..';
import bodyParser = require('body-parser');
import session from 'express-session';
import jwt from 'jsonwebtoken';
import headers from './routes/headers';
import indexsite from './routes/indexsite';
import routelogic from './routes';

export default class Server {
    private static DEFAULT_PORT: number =
        parseInt(dotenv.config().parsed.DEFAULT_WEBSERVER_PORT) || 443;
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
        this.router.use(headers.load).get('/$', indexsite.get);
        this.application.use(this.prepareRoutes(this.router));
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
    private prepareRoutes(r: express.Router): express.Router {
        r.use(headers.load).get('/$', indexsite.get);
        let _r: any = routelogic.all;
        for (const iterator in _r) {
            // console.log();
            let entries = Object.entries(_r[iterator]);

            entries.forEach((_route: any) => {
                const y = Object.keys(_route);
                y.forEach((s: any) => {
                    if (typeof _route[y[s]] === 'string') {
                        let d: string = _route[y[s]];
                        let rr = _route[1]();
                        let linkname = rr[0];
                        let fn = rr[1];

                        switch (d) {
                            case 'post':
                                r.post(linkname, fn);
                                break;
                            case 'get':
                                r.get(linkname, fn);
                                break;
                            default:
                                r.use(linkname, fn);
                                break;
                        }
                    }
                });
            });
        }
        return r;
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

import express, { NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import System from '..';
import bodyParser = require('body-parser');
import session from 'express-session';
import jwt from 'jsonwebtoken';
import apilogic from './routes';
import indexsite from '../API/routes/indexsite';

export default class API {
    private static DEFAULT_PORT: number = 81;
    private static DEFAULT_HOSTNAME: string = 'geeo';
    private static DEFAULT_VIEW_ENGINE: string = 'ejs';
    private router: express.Router = null;
    private apiRouter: express.Router = null;
    private application: express.Application = null;
    private listen: import('http').Server = null;
    private system: System = null;
    constructor(system: System) {
        this.system = system;
        this.application = express();
        this.application.use(bodyParser.json());

        let view_engine =
            dotenv.config().parsed.webrenderer || API.DEFAULT_VIEW_ENGINE;
        this.application.set('view engine', view_engine);
        this.application.set(
            'views',
            path.join(process.cwd(), `./dev/System/Templates/`)
        );
        // this.apiRouter = subdomain('api', );
        this.apiRouter = this.prepareAPIRoutes();
        this.apiRouter.get('/', indexsite.get);
        this.application.use(this.apiRouter);
        this.start();
    }
    public start(): void {
        if (this.application) {
            let port = API.DEFAULT_PORT;
            this.listen = this.application.listen(port, () => {
                this.system.emit('ready', port);
            });
        }
    }
    private prepareAPIRoutes(): express.Router {
        let r = express.Router();
        let _r: any = apilogic.all;
        for (const iterator in _r) {
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

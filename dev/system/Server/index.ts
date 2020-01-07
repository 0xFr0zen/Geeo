import express, { NextFunction } from 'express';
import index from './Index/';
import path from 'path';
import dotenv from 'dotenv';
import System from '../';
import bodyParser = require('body-parser');
// import fs from 'fs';
import cookieParser from 'cookie-parser';
import url from 'url';
import jwt from 'jsonwebtoken';

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
        this.application.use(cookieParser(dotenv.config().parsed.SECRET!));
        this.application.use(bodyParser.urlencoded({ extended: false }));
        this.application.use(function(
            req: express.Request,
            res: express.Response,
            next: NextFunction
        ) {
            res.header(
                'Access-Control-Allow-Origin',
                url.format({
                    pathname: 'http://'.concat(req.hostname),
                })
            ); // update to match the domain you will make the request from
            res.header('Access-Control-Allow-Credentials', 'true'); // update to match the domain you will make the request from
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            next();
        });
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
        this.router.use('/', index);

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

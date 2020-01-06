import dotenv from 'dotenv';
import { EventEmitter } from 'events';
import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import url from 'url';

export default class Auth extends EventEmitter {
    private application: express.Application;
    private router: express.Router;
    constructor(env: dotenv.DotenvParseOutput = dotenv.config().parsed) {
        super();
        this.application = express();

        this.application.use(bodyParser.urlencoded({ extended: false }));
        this.application.use(function(
            req: express.Request,
            res: express.Response,
            next: NextFunction
        ) {
            res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            next();
        });
        this.router = express.Router({ mergeParams: true });
        this.router.use(
            '/auth/',
            express
                .Router({ mergeParams: true })
                .post(
                    '/login$',
                    (req: express.Request, res: express.Response) => {
                        console.log(req.body);
                        let username = req.body.username;
                        let pwd = req.body.password;
                        let x = jwt.sign(
                            { username: username },
                            dotenv.config().parsed.SECRET,
                            { expiresIn: '15m' }
                        );
                        if (x) {
                            res = res.cookie('token', x, {httpOnly:true, expires: new Date(Date.now() + 900000)});
                        }
                        return res.send('GET AUTH');
                    }
                )
                .post(
                    '/logout$',
                    (req: express.Request, res: express.Response) => {
                        res.send('REV AUTH');
                    }
                )
        );

        let port: number = parseInt(env.DEFAULT_AUTH_PORT) || 4000;
        this.application.use(this.router);
        this.application.listen(port, () => {
            this.emit('ready', port);
        });
    }
}

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
            res.header('Access-Control-Allow-Credentials', 'true'); // update to match the domain you will make the request from
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
                    '/login',
                    (req: express.Request, res: express.Response) => {
                        let loginobj = req.query || req.body;
                        let username = loginobj.username;
                        let pwd = loginobj.password;
                        try {
                            let jwt1 = createAccessToken({ name: username });
                            console.log(jwt1);
                            let expDate = parseInt(
                                dotenv.config().parsed
                                    .COOKIE_EXPIRATION!
                            ) * 60 * 1000;
                            res.cookie('user', jwt1, {
                                maxAge:
                                expDate,
                                httpOnly: true,
                            });
                            return res.send({ ok: true , expDate:expDate});
                        } catch (e) {
                            return res.send({ ok: false});
                        }
                    }
                )
                .get(
                    '/logout$',
                    (req: express.Request, res: express.Response) => {
                        res.clearCookie('user');
                        return res.redirect(
                            url.format({
                                pathname: 'http://'.concat(
                                    req.hostname.concat(':80/')
                                ),
                                query: req.body,
                            })
                        );
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

function createAccessToken(obj: any) {
    return jwt.sign(obj, dotenv.config().parsed.SECRET!, {
        expiresIn: dotenv.config().parsed.COOKIE_EXPIRATION! + 'm',
    });
}
function createRefreshToken(obj: any) {
    return createAccessToken(obj);
}

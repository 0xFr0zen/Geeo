import * as express from 'express';
import index from './Index/';
import * as path from 'path';
import * as dotenv from 'dotenv';
import System from '../';
import bodyParser = require('body-parser');

export default class Server {
    private static DEFAULT_PORT: number = 80;
    private static DEFAULT_HOSTNAME: string = 'geeo';
    private static DEFAULT_VIEW_ENGINE:string = 'vash';
    private router: express.Router = null;
    private application: express.Application = null;
    private listen: import("http").Server = null;
    private system:System = null;
    constructor(system:System) {
        this.system = system;
        this.application = express();
        this.application.use(bodyParser.urlencoded({ extended: false }));
        this.router = express.Router({mergeParams:true});
        let view_engine = dotenv.config().parsed.webrenderer || Server.DEFAULT_VIEW_ENGINE;
        this.application.set('view engine', view_engine);

        this.application.set(
            'views',
            path.join(
                process.cwd(),
                `./dev/system/Server/Web/Templates/${view_engine}/`,
                
            )
        );
        this.router.use('/', index);

        this.application.use(this.router);
    }
    public start(): void {
        if (this.application) {
            this.listen = this.application.listen(Server.DEFAULT_PORT, () => {
                this.system.emit('ready');
            });
            
        }
    }
}

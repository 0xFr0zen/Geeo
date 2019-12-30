import * as express from 'express';
import index from './Index/';
import * as path from 'path';
import * as dotenv from 'dotenv';
import bodyParser = require('body-parser');

export default class Server {
    private static DEFAULT_PORT: number = 80;
    private static DEFAULT_HOSTNAME: string = 'geeo';
    private static DEFAULT_VIEW_ENGINE:string = 'vash';
    private router: express.Router = null;
    private application: express.Application = null;
    private listen: import("http").Server = null;
    constructor() {
        let me = this;
        this.application = express();
        this.application.use(bodyParser.urlencoded({ extended: false }));
        this.router = express.Router({mergeParams:true});
        let view_engine = dotenv.config().parsed.webrenderer || Server.DEFAULT_VIEW_ENGINE;
        this.application.set('view engine', view_engine);
        console.log(`View engine: ${view_engine}`);

        this.application.set(
            'views',
            path.join(
                process.cwd(),
                `./dev/Server/Web/Templates/${view_engine}/`,
                
            )
        );
        this.router.use('/', index);

        this.application.use(this.router);
    }
    public start(): void {
        if (this.application) {
            let me = this;
            this.listen = this.application.listen(Server.DEFAULT_PORT, function() {
                console.log(`Server runs on port ${Server.DEFAULT_PORT}`);
                
            });
            
        }
    }
}

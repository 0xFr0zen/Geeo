import * as express from 'express';
import index from './Index/';
import * as path from 'path';
import bodyParser = require('body-parser');
export default class Server {
    private static DEFAULT_PORT: number = 80;
    private static DEFAULT_HOSTNAME: string = 'geeo';
    private router: express.Router = null;
    private application: express.Application = null;
    constructor() {
        this.application = express();
        this.application.use(bodyParser.urlencoded({ extended: false }));
        this.router = express.Router({mergeParams:true});
        this.application.set('view engine', 'vash');
        this.application.set(
            'views',
            path.join(
                process.cwd(),
                './dev/Server/Web/Templates/'
            )
        );
        this.router.use('/', index);

        this.application.use(this.router);
    }
    public start(): void {
        if (this.application) {
            let me = this;
            this.application.listen(Server.DEFAULT_PORT, function() {
                console.log(`runs on port ${Server.DEFAULT_PORT}`, arguments);
            });
        }
    }
}

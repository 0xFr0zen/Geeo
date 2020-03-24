import express, { NextFunction } from 'express';
import path from 'path';
import bodyParser = require('body-parser');
import System from '../System';
import headers from './routes/headers';
import { prepareRoutes } from './preparer';

export default class Server {
    private router: express.Router = null;
    private static port: number = 80;
    private application: express.Application = null;
    private listen: import('http').Server = null;
    private system: System = null;
    private ownPort: number;

    constructor(system: System, rlogic: any) {
        this.ownPort = Server.port++;
        this.system = system;
        this.application = express();
        this.application.use(bodyParser.json());
        this.router = express.Router({
            mergeParams: true,
        });
        this.application.set('view engine', 'ejs');
        this.application.set(
            'views',
            path.join(process.cwd(), `./dev/System/Templates/`)
        );
        this.router.use(headers.load);
        this.router.use(
            prepareRoutes(
                express.Router({
                    mergeParams: true,
                }),
                rlogic
            )
        );
        this.application.use(this.router);
    }

    public start(port?: number): void {
        if (this.application) {
            if (port) {
                this.listen = this.application.listen(port, () => {
                    this.system.emit('ready', port);
                });
            } else {
                this.listen = this.application.listen(this.ownPort, () => {
                    this.system.emit('ready', this.ownPort);
                });
            }
        }
    }

    public stop() {
        this.listen.close();
        this.system.emit('closed', this.ownPort);
    }
}

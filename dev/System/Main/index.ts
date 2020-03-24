import routelogic from './routes';
import Server from '../../Server';
import System from '..';

export default class Main extends Server {
    constructor(system: System) {
        super(system, routelogic);
    }
}

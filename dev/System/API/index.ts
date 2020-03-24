import System from '..';
import apilogic from './routes';
import Server from '../../Server';

export default class API extends Server {
    constructor(system: System) {
        super(system, apilogic);
    }
}

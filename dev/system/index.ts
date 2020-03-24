import Device, { PK_IDENTITY } from './Device';
import * as dotenv from 'dotenv';
import Entity from './Entity';
import API from './API';
import ConsoleIO from './ConsoleIO';
import Main from './Main/index';

export default class System extends Entity {
    private static device: Device = new Device();
    private server: Main = null;
    private api: API = null;
    private consoleIO: ConsoleIO;
    constructor(env: dotenv.DotenvParseOutput = dotenv.config().parsed) {
        super('system', env.SYSTEM_NAME);
        this.server = new Main(this);
        this.api = new API(this);

        this.server.start();
        this.api.start();
    }
    public static getDevice(): Device {
        return this.device;
    }
}

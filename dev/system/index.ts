import Device, { PK_IDENTITY } from './Device';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import Entity from './Entity';
import Server from './Server';
import getMAC from 'getmac';
import Node from '../Crypt';
import ConsoleIO from './ConsoleIO';

export default class System extends Entity {
    private static device: Device = new Device();
    private server: Server;
    private consoleIO: ConsoleIO;
    constructor(env: dotenv.DotenvParseOutput = dotenv.config().parsed) {
        super('system', env.SYSTEM_NAME);
        this.server = new Server(this);
    }
    public static getDevice(): Device {
        return this.device;
    }
    
}

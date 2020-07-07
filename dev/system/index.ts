import Device, { PK_IDENTITY } from './Device';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import Identity from './Identity';
import Entity from './Entity';
import Server from './Server';
import getMAC from 'getmac';
import Node from './Crypt';
import { reset } from '../../reset';
import ConsoleIO from './ConsoleIO';

export default class System extends Entity {
    private static device: Device = new Device();
    private ADMIN: Identity;
    private server: Server;
    private consoleIO: ConsoleIO;
    constructor(env: dotenv.DotenvParseOutput = dotenv.config().parsed) {
        super('system', env.SYSTEM_NAME);
        reset().then((folders)=>{
            this.createFolders();
            this.addParameter('admin', this.createIdentity(env.ADMIN_USERNAME));
            System.device.initialize();
            this.server = new Server(this);
            this.consoleIO = new ConsoleIO(this);
        }).catch((e)=> {
            console.error(e);
        });
        
    }
    public static getDevice(): Device {
        return this.device;
    }
    
    /**
     *
     * Creates Identity and stores it.
     * @param {string} name
     * @memberof Device
     */
    public createIdentity(name: string): Identity {
        let i: Identity;
        // console.error(`Trying to create Identity '${name}'.`);
        if (!System.device.hasIdentity(name)) {
            let mac_hex = Buffer.from(
                getMAC()
                    .split(':')
                    .join(''),
                'hex'
            ).toString('hex');
            let s = mac_hex.toString();
            let diff = 32 - s.length;
            let additionalSLength = Math.ceil(Math.log2(diff)) * 2;
            let randomS = Node.randomString(additionalSLength);
            let newS: string = s.concat(
                Buffer.from(randomS, 'utf8').toString('hex')
            );
            let pk = Buffer.from(newS, 'hex');
            i = new Identity(name, pk);
            let pk_i: PK_IDENTITY = { pk: pk, ident: i };
            System.device.addIdentity(name, pk_i);
        } else {
            i = System.device.getIdentity(name);
        }
        return i;
    }
    private createFolders() {
        let rootpath = path.join(process.cwd());
        let MAC_ADRESS_HEX = Buffer.from(
            getMAC()
                .split(':')
                .join(''),
            'hex'
        ).toString('hex');
        let paths: any = {
            saved: path.join(rootpath, `saved/`),
            device1: path.join(rootpath, `saved/device/`),
            device2: path.join(rootpath, `saved/device/${MAC_ADRESS_HEX}/`),
            entities: path.join(rootpath, 'saved/entities/'),
            default_entities: path.join(rootpath, 'saved/entities/unknown/'),
            default_entitie_snapshots: path.join(
                rootpath,
                'saved/entities/unknown/snapshots'
            ),
            users: path.join(rootpath, 'saved/entities/users/'),
        };

        for (let key in paths) {
            let folder = paths[key];
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
            }
        }
    }
}

import Device, { PK_IDENTITY } from '../Device';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import Identity from '../Identity';
import Entity from '../Entity';
import Server from '../Server';
import getMAC from 'getmac';
import Node from '../Crypt/index';
import { reset } from '../../reset';
import { app, BrowserWindow } from 'electron';
export default class System extends Entity {
    private static device: Device = new Device();
    private ADMIN: Identity = null;
    private server: Server = null;
    private mainWindow: BrowserWindow = null;
    constructor(env: dotenv.DotenvParseOutput = dotenv.config().parsed) {
        super('system', env.SYSTEM_NAME);
        reset();
        this.createFolders();
        this.addParameter('admin', this.createIdentity(env.ADMIN_USERNAME));
        System.device.initialize();
        this.server = new Server();
        this.server.start();
        let me = this;
        app.on('ready', function() {
            me.mainWindow = new BrowserWindow({
                darkTheme: true,
                center: true,
                title: 'Geeo',
                show: false,
                webPreferences: {
                    contextIsolation: true,
                    javascript: true,
                },
                width: 1280,
                height: 720,
            });
            me.mainWindow.on('ready-to-show', function() {
                me.mainWindow.show();
            });
            me.mainWindow.loadURL('http://localhost/');
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
        let i: Identity = null;
        console.error(`Trying to create Identity '${name}'.`);
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
            console.log(`Created Identity '${name}'.`);
        } else {
            console.error('Identity exists already, aborting.');
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
                console.log(`created '${key}' folder`);
            }
        }
    }
}

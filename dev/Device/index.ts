import Identity from '../Identity';
import { GeeoMap } from '../GeeoMap';
import getMAC from 'getmac';
import Node from '../Crypt';
import * as fs from 'fs';
import * as path from 'path';
import Entity from '../Entity';
interface PK_IDENTITY {
    pk: Buffer;
    ident: Identity;
}
export default class Device extends Entity {
    private static ENTITY: Device = null;
    private static identities: GeeoMap<
        string,
        PK_IDENTITY
    > = Device.loadIdentities();
    private static PUBLIC_KEY = Device.loadPublicKey();
    private static MAC_ADRESS = getMAC();
    private static MAC_ADRESS_HEX = Buffer.from(
        Device.MAC_ADRESS.split(':').join(''),
        'hex'
    ).toString('hex');
    private static CURRENT: Device = Device.ENTITY;
    constructor() {
        super('device', Device.MAC_ADRESS_HEX);
        if (Device.ENTITY == null) {
            Device.ENTITY = this;
            this.save();
        } else {
            throw new Error('ONLY ONE DEVICE CAN BE STORED. (so far)');
        }
    }
    public static current(){
        return Device.ENTITY;
    }
    /**
     * Checks if Identity exists
     *
     * @static
     * @param {string} name
     * @returns
     * @memberof Device
     */
    public hasIdentity(name: string) {
        return Device.identities.hasItem(name);
    }
    private static loadIdentities(): GeeoMap<string, PK_IDENTITY> {
        let result = new GeeoMap<string, PK_IDENTITY>();
        let rootUsers = path.join(
            process.cwd(),
            './saved/entities/users/'
        );
        let f = fs.readdirSync(rootUsers);
        f.filter((v: string, index: number) => {
            return fs.statSync(path.join(rootUsers, v)).isDirectory();
        });
        f.forEach(value => {
            let name = Buffer.from(value, 'hex').toString('utf8');
            let user_path = path.join(rootUsers, value, 'user');
            let user_pk = fs.readFileSync(user_path).toString();
            result = result.addItem(name, {
                ident: Identity.of(name),
                pk: Buffer.from(user_pk, 'hex'),
            });
        });

        return result;
    }
    private static loadPublicKey(): Buffer {
        let s = Node.randomString(16);
        let path2 = path.join(
            process.cwd(),
            './saved/device/k'
        );
        if (fs.existsSync(path2)) {
            let sstring = fs.readFileSync(path2).toString();
            if (sstring.length > 0) {
                s = sstring;
            } else {
                fs.writeFileSync(path2, s);
            }
        } else {
            fs.writeFileSync(path2, s);
        }
        let b = Buffer.from(s, 'utf8');
        return b;
    }
    public getPublicKey(): Buffer {
        return Device.PUBLIC_KEY;
    }
    /**
     *
     * Gives Identity based on name (if exists);
     * @static
     * @param {string} name
     * @returns
     * @memberof Device
     */
    public getIdentity(name: string): Identity {
        return this.hasIdentity(name)
            ? Device.identities.getItem(name).ident
            : null;
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
        if (!this.hasIdentity(name)) {
            let s = Device.MAC_ADRESS_HEX;
            let diff = 32 - s.length;
            let additionalSLength = Math.ceil(Math.log2(diff)) * 2;
            let randomS = Node.randomString(additionalSLength);
            let newS: string = s.concat(
                Buffer.from(randomS, 'utf8').toString('hex')
            );
            let pk = Buffer.from(newS, 'hex');
            i = new Identity(name, pk);
            let pk_i: PK_IDENTITY = { pk: pk, ident: i };
            Device.identities = Device.identities.addItem(name, pk_i);
            console.log(`Created Identity '${name}'.`);
        } else {
            console.error('Identity exists already, aborting.');
            i = Device.identities.getItem(name).ident;
        }
        return i;
    }

    /**
     *
     * Gives private key of Device.
     * @static
     * @returns {Buffer}
     * @memberof Device
     */
    public getPrivateKey(name: string): Buffer {
        return Device.identities.getItem(name).pk;
    }
}

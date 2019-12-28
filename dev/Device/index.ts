import Identity from '../Identity';
import { GeeoMap } from '../GeeoMap';
import getMAC from 'getmac';
import Node from '../Crypt';
import * as fs from 'fs';
import * as path from 'path';
import Entity from '../Entity';
export interface PK_IDENTITY {
    pk: Buffer;
    ident: Identity;
}
export default class Device extends Entity {
    
    private identities: GeeoMap<string, PK_IDENTITY> = new GeeoMap<
        string,
        PK_IDENTITY
    >();
    constructor() {
        super(
            'device',
            Buffer.from(
                getMAC()
                    .split(':')
                    .join(''),
                'hex'
            ).toString('hex')
        );
        if (!this.hasParameter('entity')) {
            this.addParameter('entity', this);
            this.addParameter(
                'mac_hex',
                Buffer.from(
                    getMAC()
                        .split(':')
                        .join(''),
                    'hex'
                ).toString('hex')
            );
            this.addParameter('mac', getMAC());

            // this.save();
        } else {
            throw new Error('ONLY ONE DEVICE CAN BE STORED. (so far)');
        }
    }

    /**
     * Checks if Identity exists
     *
     * @static
     * @param {string} name
     * @returns {boolean} true/false if Identity exists
     * @memberof Device
     */
    public hasIdentity(name: string): boolean {
        return this.identities.hasItem(name);
    }
    public addIdentity(name: string, pk_i: PK_IDENTITY) {
        this.identities = this.identities.addItem(name, pk_i);
    }
    public initialize(){
        this.addParameter('public_key', this.loadPublicKey());
        this.addParameter('private_key', this.getPrivateKey('admin'));
        console.log("initialized device");
        
    }
    /**
     *  loads saved Identies into memory
     *
     * @private
     * @static
     * @returns {GeeoMap<string, PK_IDENTITY>}
     * @memberof Device
     */
    private loadIdentities(): GeeoMap<string, PK_IDENTITY> {
        let result = new GeeoMap<string, PK_IDENTITY>();
        let rootUsers = path.join(process.cwd(), './saved/entities/users/');
        if (fs.existsSync(rootUsers)) {
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
        }

        return result;
    }

    /**
     * loadsPublicKey of curent device
     *
     * @private
     * @static
     * @returns {Buffer}
     * @memberof Device
     */
    private loadPublicKey(): Buffer {
        let s = Node.randomString(32);
        let MAC_ADRESS_HEX = Buffer.from(
            getMAC()
                .split(':')
                .join(''),
            'hex'
        ).toString('hex');
        let path2 = path.join(
            process.cwd(),
            `./saved/device/${MAC_ADRESS_HEX}/k`
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

    /**
     * Returns Public Key of device
     *
     * @returns {Buffer} Buffered "Array" of public key
     * @memberof Device
     */
    public getPublicKey(): Buffer {
        let pubk = this.getParameter('public_key').toString();
        return Buffer.from(pubk, 'hex');
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
            ? this.identities.getItem(name).ident
            : null;
    }

    /**
     *
     * Gives private key of Device.
     * @static
     * @returns {Buffer}
     * @memberof Device
     */
    public getPrivateKey(name: string): Buffer {
        
        return this.hasIdentity(name) ? this.identities.getItem(name).pk : null;
    }
}

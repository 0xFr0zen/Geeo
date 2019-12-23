import Identity from '../Identity/index';
import { GeeoMap } from '../GeeoMap/index';
import Node from '../Crypt/index';
import getMAC from 'getmac'

export default abstract class Device {
    private static identities: GeeoMap<string, Identity> = null;
    private static MAC_ADRESS = getMAC();
    private static PR_KEY: Buffer = Buffer.from(Device.MAC_ADRESS.split(":").join(""),'hex');

    public static hasIdentity(name: string) {
        return Device.identities.hasItem(name);
    }
    /**
     *
     * Gives Identity based on name (if exists);
     * @static
     * @param {string} name
     * @returns
     * @memberof Device
     */
    public static getIdentity(name: string) {
        return Device.hasIdentity(name)
            ? Device.identities.getItem(name)
            : null;
    }

    /**
     *
     * Gives private key of Device.
     * @static
     * @returns {Buffer}
     * @memberof Device
     */
    public static getPrivateKey(): Buffer {
        return Device.PR_KEY;
    }
}

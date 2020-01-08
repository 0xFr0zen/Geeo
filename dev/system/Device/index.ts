import getMAC from 'getmac';
import * as fs from 'fs';
import * as path from 'path';
import Entity from '../Entity';
export interface PK_IDENTITY {
    pk: Buffer;
    ident: string;
}
export default class Device extends Entity {
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
}

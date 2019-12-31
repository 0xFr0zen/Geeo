import { exec } from 'child_process';
import Device from '../Device/index';

export default class ConsoleIO {
    private stdin: any = null;
    private stdout: any = null;
    private handler: NodeJS.Timeout = null;
    private ready: boolean = false;
    constructor(device: Device) {
        this.stdin = null;
        this.stdout = null;
        this.handler = setTimeout(this.parse, 1000);
    }
    public parse(): void {
        console.log(`parser is ${this.ready ? 'ON' : 'OFF'}`);
        if (this.ready) {
            this.exec();
        }
    }
    public exec(): void {}
}

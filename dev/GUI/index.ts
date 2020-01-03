import * as child_process from 'child_process';
import * as path from 'path';
export default class GUI {
    private gui_process: child_process.ChildProcess = null;
    constructor() {
        try {
            this.gui_process = child_process.fork(
                `${path.join(process.cwd(), './node_modules/electron/cli.js')}`,
                [`${path.join(process.cwd(), './output/dev/GUI/app.js')}`],
                { stdio: 'inherit' }
            );
            this.gui_process.on(
                'exit',
                (code: number, signal: NodeJS.Signals) => {
                    console.log('GUI EXITED');
                }
            );
            this.gui_process.on('error', (error: Error) => {
                console.log('GUI ERROR', error);
                this.gui_process = null;
            });
        } catch (e) {
            console.error(e);
        }
    }
    public show() {
        if(this.gui_process != null) this.gui_process.send({ visible: true });
        
    }

    public hide() {
        if(this.gui_process != null) this.gui_process.send({ visible: false });
    }
}

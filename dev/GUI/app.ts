import { app, BrowserWindow } from 'electron';
import * as dotenv from 'dotenv';

export default class Application {
    private mainWindow: BrowserWindow = null;
    constructor() {
        app.on('ready', () => {
            this.mainWindow = new BrowserWindow({
                darkTheme: true,
                center: true,
                title: dotenv.config().parsed.windowtitle,
                show: false,
                webPreferences: {
                    contextIsolation: true,
                    javascript: true,
                },
                width: 1280,
                height: 720,
            });
            this.mainWindow.on('ready-to-show', () => {
                this.mainWindow.show();
            });
            this.mainWindow.loadURL('http://localhost/');
        });
        process.on('message', o => {
            console.log("GOT A MESSAGE");
            
            if (typeof o.visible !== 'undefined') {
                if (o.visible) {
                    app.show();
                } else {
                    app.hide();
                }
            } else {
            }
        });
    }
}
let a = new Application();

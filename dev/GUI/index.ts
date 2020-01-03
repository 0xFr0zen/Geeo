import {app, BrowserWindow} from 'electron';
import * as dotenv from 'dotenv';

export default class GUI {
    private mainWindow:BrowserWindow = null;
    constructor() {
        app.on('ready', () => {
            this.mainWindow = new BrowserWindow({
                darkTheme: true,
                center: true,
                title: dotenv.config().parsed.windowtitle || "Geeo",
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

    }
    
    public show() {
        app.show();
    }

    public hide() {
        app.hide();
    }
}

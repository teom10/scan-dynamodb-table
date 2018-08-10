const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

app.on('ready', _ => {
    console.log('application ready');
    mainWindow = new BrowserWindow({
        height: 700,
        width: 1800
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

/**
 * Auditoria de cambios
 * Quien?
 * Cuando?
 * Que?
 * Guardar solo campos que se modificaron
 */
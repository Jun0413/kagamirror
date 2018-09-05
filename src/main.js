const electron = require("electron");

const { app, BrowserWindow, ipcMain:ipc } = electron;

let mainWindow;

app.on("ready", _ => {

    mainWindow = new BrowserWindow({
        fullscreen: true
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on("close", _ => {
        mainWindow = null;
    });

    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on("did-finish-load", _ => {

        mainWindow.webContents.send("display-clock");

        // setTimeout(_ => {
        //     mainWindow.webContents.send("remove-clock");
        // }, 5000);

        mainWindow.webContents.send("display-weather-now");

        // setTimeout(_ => {
        //     mainWindow.webContents.send("remove-weather-now")
        // }, 6000);

        mainWindow.webContents.send("display-headlines");

        // setTimeout(_ => {
        //     mainWindow.webContents.send("remove-headlines");
        // }, 1000 * 2);
    });
});
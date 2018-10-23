const electron = require("electron");
const express = require('express');
const bodyParser = require('body-parser');

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

        // mainWindow.webContents.send("display-text", "Hi, there!");
        changeTextCallBack("Hi, there!");
    });
});

function changeTextCallBack(text) {
    mainWindow.webContents.send("display-text", text);
}

// test rest callback
let _app = express();
_app.use(bodyParser.json());
_app.use(bodyParser.urlencoded({ extended: true }));
_app.get('/', (_, res) => {
    res.status(200).send('Welcome to RESTful APIs');
    changeTextCallBack('Welcome to RESTful APIs');
});
_app.post('/showAnswer', (req, res) => {
    console.log(req.body.res.message); // log received json
    res.set('Content-Type', 'text/plain');
    res.end("yes"); // echo response text
    changeTextCallBack(req.body.res.message);
});
let server = _app.listen(3000, function() {
    console.log('app running on port ', server.address().port);
});

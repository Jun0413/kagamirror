const electron = require("electron");
const express = require('express');
const bodyParser = require('body-parser');
const {spawn, exec} = require('child_process');

const { app, BrowserWindow, ipcMain:ipc } = electron;

let mainWindow;

app.on("ready", _ => {

    mainWindow = new BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true
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
        // }, 4000);

        mainWindow.webContents.send("display-weather");
        // setTimeout(_ => {
        //     mainWindow.webContents.send("remove-weather");
        // }, 6000);

        mainWindow.webContents.send("display-headlines");
        // setTimeout(_ => {
        //     mainWindow.webContents.send("remove-headlines");
        // }, 1000 * 5);

        mainWindow.webContents.send("display-quotes");
        // setTimeout(_ => {
        //     mainWindow.webContents.send("remove-quotes");
        // }, 1000 * 15);

        mainWindow.webContents.send("display-FAQbot");
        // mainWindow.webContents.send("display-speechgrader");
        // showQuestion("Question one. What language have you learned?");
        // setTimeout(_ => {
        //     showCountdown("Preparation", 5);
        // }, 3000);

        mainWindow.webContents.send("display-notification");
        // setTimeout(_ => {
        //     mainWindow.webContents.send("remove-notification");
        // }, 1000 * 10);

        mainWindow.webContents.send("display-school-events");
        // setTimeout(_ => {
        //     mainWindow.webContents.send("remove-school-events");
        // }, 1000 * 15);

        // mainWindow.webContents.send("display-text", "Hi, there!");
        // changeTextCallBack("Hi, there!");
    });
});

//////////////////// Express Server ////////////////////

function changeTextCallBack(text) {
    mainWindow.webContents.send("display-text", text);
}

function showAnswer(answer) { // for FAQBot
    mainWindow.webContents.send("show-answer", answer);
}

function showQuestion(question) { // for SpeechGrader
    mainWindow.webContents.send("show-question", question);
}

function showCountdown(text, duration) {
    mainWindow.webContents.send("show-countdown", text, duration);
}

function showLoading() {
    mainWindow.webContents.send("show-loading");
}

function showGrade(grades) {
    mainWindow.webContents.send("show-grades", ...grades);
}

function showError(message) {
    mainWindow.webContents.send("show-error", message);
}

function showNotificationContent(notification, date) {
    mainWindow.webContents.send("show-notification-content", notification, date);
}

function hideNotificationContent() {
    mainWindow.webContents.send("remove-notification-content");
}

/**
 * slot code <=> module
 * 0: clock         4: news
 * 1: weather       5: quote
 * 2: q and a       6: recent events
 * 3: notification  7: introduction
 * 8: light (all)
 */
function turnonModule(slotCode) {
    if (slotCode == "0") { mainWindow.webContents.send("display-clock"); }
    else if (slotCode == "1") { mainWindow.webContents.send("display-weather"); }
    else if (slotCode == "2") { mainWindow.webContents.send("display-FAQbot"); }
    else if (slotCode == "3") { mainWindow.webContents.send("display-notification"); }
    else if (slotCode == "4") { mainWindow.webContents.send("display-headlines"); }
    else if (slotCode == "5") { mainWindow.webContents.send("display-quotes"); }
    else if (slotCode == "6") { mainWindow.webContents.send("display-school-events"); }
    else if (slotCode == "7") {
        mainWindow.webContents.send("display-clock");
        mainWindow.webContents.send("display-weather");
        mainWindow.webContents.send("display-headlines");
        mainWindow.webContents.send("display-quotes");
        mainWindow.webContents.send("display-school-events");
        mainWindow.webContents.send("display-notification");
        mainWindow.webContents.send("display-FAQbot");
    }
    else console.error("invalid slotCode received: ", slotCode);
}

function turnoffModule(slotCode) {
    if (slotCode == "0") { mainWindow.webContents.send("remove-clock"); }
    else if (slotCode == "1") { mainWindow.webContents.send("remove-weather"); }
    else if (slotCode == "2") { mainWindow.webContents.send("remove-FAQbot"); }
    else if (slotCode == "3") { mainWindow.webContents.send("remove-notification"); }
    else if (slotCode == "4") { mainWindow.webContents.send("remove-headlines"); }
    else if (slotCode == "5") { mainWindow.webContents.send("remove-quotes"); }
    else if (slotCode == "6") { mainWindow.webContents.send("remove-school-events"); }
    else if (slotCode == "7") {
        mainWindow.webContents.send("remove-clock");
        mainWindow.webContents.send("remove-weather");
        mainWindow.webContents.send("remove-headlines");
        mainWindow.webContents.send("remove-quotes");
        mainWindow.webContents.send("remove-school-events");
        mainWindow.webContents.send("remove-notification");
        mainWindow.webContents.send("remove-FAQbot");
    }
    else console.error("invalid slotCode received: ", slotCode);
}

function launchAlexa() {
    // all bash script
    // npm start
    // java client
    // wakewordAgent
}

function startWakewordAgent() {
    // N.A
}

function stopWakewordAgent() {
    // N.A
}

function launchSpeechGrader() {
    /**
     * Remember to chmod +x <script>
     */
   
    mainWindow.webContents.send("display-speechgrader");
    /**
     * Mac
     */
    exec('open -a Terminal -j ~/Desktop/FYP/kagamirror/amadeus/launch.sh');
}

// _app: app on express server
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
    showAnswer(req.body.res.message);
});

_app.post('/launchSpeechGrader', (_, res) => {
    res.set('Content-Type', 'text/plain');
    res.end("yes");
    launchSpeechGrader();
});

_app.post('/showQuestion', (req, res) => {
    console.log("question received: ", req.body.question);
    showQuestion(req.body.question);
    res.set('Content-Type', 'text/plain');
    res.end("yes");
});

_app.post('/showCountdown', (req, res) => {
    showCountdown(req.body.text, req.body.duration);
    res.set('Content-Type', 'text/plain');
    res.end("yes");
});

_app.post('/showLoading', (_, res) => {
    showLoading();
    res.set('Content-Type', 'text/plain');
    res.end("yes");
});

_app.post('/showGrade', (req, res) => {
    showGrade(req.body.grades);
    res.set('Content-Type', 'text/plain');
    res.end("yes");
});

_app.post('/showError', (req, res) => {
    showError(req.body.message);
    res.set('Content-Type', 'text/plain');
    res.end("yes");
});

_app.post('/showNotification', (req, res) => {
    console.log("notification received: ", req.body.text);
    showNotificationContent(req.body.text, req.body.date);
    res.set('Content-Type', 'text/plain');
    res.end("yes");
});

_app.get('/removeNotification', (_, res) => {
    hideNotificationContent();
    res.status(200).send('successfully removed notification');
});

_app.post('/turnonModule', (req, res) => {
    turnonModule(req.body.slotCode);
    res.set('Content-Type', 'text/plain');
    res.end('yes');
});

_app.post('/turnoffModule', (req, res) => {
    turnoffModule(req.body.slotCode);
    res.set('Content-Type', 'text/plain');
    res.end('yes');
});

let server = _app.listen(8000, function() {
    console.log('app running on port ', server.address().port);
    spawn('bash', ['./rest/serveo.sh']);
});

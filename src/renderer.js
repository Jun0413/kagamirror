const electron = require("electron");
const moment = require("moment");
const headlines = require("../modules/essentials/headlines");

const { ipcRenderer:ipc } = electron;

const clockDiv = document.getElementsByClassName("block top left")[0].firstChild;
const weatherDiv = document.getElementsByClassName("block top right")[0].firstChild;
const headlineDiv = document.getElementsByClassName("block bottom up")[0].firstChild;
const textDiv = document.getElementsByClassName("block middle center")[0].firstChild;

function displayClock() {
    console.log("[execute] displayClock()");
    startClocking(clockDiv);
}

function removeClock() {
    console.log("[execute] removeClock()");
    clockDiv.innerHTML = "";
    stopClocking();
}

function displayWeather() {
    console.log("[execute] displayWeather()");
    startWeather(weatherDiv);
}

function removeWeather() {
    console.log("[execute] removeWeather()");
    weatherDiv.innerHTML = "";
    stopWeather();
}

function displayHeadlines() {
    console.log("[execute] displayHeadlines()");
    headlines.displayHeadlines((newsAgency, headlineInfo) => {
        if (headlineInfo) {
            headlineDiv.innerHTML = newsAgency + " "
                + moment(new Date(headlineInfo.pubdate)).fromNow()
                + "<br>" + headlineInfo.title;
        }
    });
}

function displayText(text) {
    console.log("[execute] displayText(text)");
    textDiv.innerHTML = text;
}

//////////////////// Schedule Ipc Handler ////////////////////

ipc.on("display-clock", _ => {
    console.log("[renderer] received display-clock");
    displayClock();
});

ipc.on("remove-clock", _ => {
    console.log("[renderer] received remove-clock");
    removeClock();
});

ipc.on("display-weather", _ => {
    console.log("[renderer] received display-weather");
    displayWeather();
});

ipc.on("remove-weather", _ => {
    console.log("[renderer] received remove-weather");
    removeWeather();
});

ipc.on("display-headlines", _ => {
    console.log("[renderer] received display-headlines");
    displayHeadlines();
});

ipc.on("remove-headlines", _ => {
    console.log("[renderer] received remove-headlines");
});

ipc.on("display-text", (_, text) => {
    console.log(`[renderer] received display-text: ${text}`);
    displayText(text);
});
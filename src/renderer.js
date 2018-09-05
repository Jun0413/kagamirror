const electron = require("electron");
const moment = require("moment");
const clock = require("../modules/essentials/clock");
const weatherNow = require("../modules/essentials/weather_now");
const headlines = require("../modules/essentials/headlines");

const { ipcRenderer:ipc } = electron;

const clockDiv = document.getElementsByClassName("block top left")[0].firstChild;
const weatherDiv = document.getElementsByClassName("block top right")[0].firstChild;
const headlineDiv = document.getElementsByClassName("block bottom up")[0].firstChild;

function displayClock() {
    console.log("[execute] displayClock()");
    clock.startClocking((dateString, hour, minute, second) => {
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        clockDiv.innerHTML = dateString + "<br>" + hour + ":" + minute + ":" + second;
    });
}

function removeClock() {
    console.log("[execute] removeClock()");
    clock.stopClocking(_ => {
        clockDiv.innerHTML = "";
    });
}

function displayWeatherNow() {
    console.log("[execute] displayWeatherNow()");
    weatherNow.displayWeatherNow((weather, temp) => {
        weatherDiv.innerHTML = weather + "<br>" +
            (temp - 273.15).toFixed(2) + "&deg;C";
    });
}

function removeWeatherNow() {
    console.log("[execute] removeWeatherNow()");
    weatherNow.stopWeatherNow(_ => {
        weatherDiv.innerHTML = "";
    });
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

//////////////////// Schedule Ipc Handler ////////////////////

ipc.on("display-clock", _ => {
    console.log("[renderer] received display-clock");
    displayClock();
});

ipc.on("remove-clock", _ => {
    console.log("[renderer] received remove-clock");
    removeClock();
});

ipc.on("display-weather-now", _ => {
    console.log("[renderer] received display-weather-now");
    displayWeatherNow();
});

ipc.on("remove-weather-now", _ => {
    console.log("[renderer] received remove-weather-now");
    removeWeatherNow();
});

ipc.on("display-headlines", _ => {
    console.log("[renderer] received display-headlines");
    displayHeadlines();
});

ipc.on("remove-headlines", _ => {
    console.log("[renderer] received remove-headlines");
});
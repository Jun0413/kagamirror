const electron = require("electron");
const moment = require("moment");

const headlines = require("../modules/headlines/headlines");
const quotes = require("../modules/quotes/quotes");

const { ipcRenderer:ipc } = electron;

const clockDiv = document.getElementsByClassName("block top left")[0].firstChild;
const weatherDiv = document.getElementsByClassName("block top right")[0].firstChild;
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
    $("head").append(`<link rel="stylesheet" href="../modules/headlines/headlines.css" id="style-headlines">`);
    $(".block.bottom.up").find(".container").html(
        `<div class="newsagency"></div><div class="newsheadline"></div>`
    );

    headlines.displayHeadlines((newsAgency, headlineInfo) => {
        if (headlineInfo) {
            $(".newsheadline").fadeOut('slow', function() {
                $(this).text(headlineInfo.title).fadeIn('slow');
            });
            $(".newsagency").fadeOut('slow', function() {
                $(this).text(newsAgency + " " + moment(new Date(headlineInfo.pubdate)).fromNow()).fadeIn('slow');
            });
        }
    });
}

function removeHeadlines() {
    console.log("[execute] removeHeadlines()");
    headlines.stopHeadlines(_ => {
        $(".block.bottom.up").find(".container").empty();
        $("head").find("link#style-headlines").remove();
    });
}

function displayQuotes() {
    console.log("[execute] displayQuotes()");
    $("head").append(`<link rel="stylesheet" href="../modules/quotes/quotes.css" id="style-quotes">`);
    quotes.startQuotes(quote => {
        $(".block.bottom.down").find(".container").html(quote);
    });
}

function removeQuotes() {
    quotes.stopQuotes(_ => {
        $(".block.bottom.down").find(".container").empty();
        $("head").find("link#style-quotes").remove();
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
    removeHeadlines();
});

ipc.on("display-quotes", _ => {
    console.log("[renderer] received display-quotes");
    displayQuotes();
})

ipc.on("remove-quotes", _ => {
    console.log("[renderer] received remove-quotes");
    removeQuotes();
});

ipc.on("display-text", (_, text) => {
    console.log(`[renderer] received display-text: ${text}`);
    displayText(text);
});
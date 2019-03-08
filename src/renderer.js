const electron = require("electron");
const moment = require("moment");

const headlines = require("../modules/headlines/headlines");
const quotes = require("../modules/quotes/quotes");
const schoolEvents = require("../modules/school_events/school_events");

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
    console.log("[execute] removeQuotes()");
    quotes.stopQuotes(_ => {
        $(".block.bottom.down").find(".container").empty();
        $("head").find("link#style-quotes").remove();
    });
}

function displayFAQBot() {
    console.log("[execute] displayFAQBot()");
    startFAQBot();
}

function displayAnswer(answer) {
    console.log("[execute] displayAnswer(answer)");
    startAnswer(answer); // in ../alexa/mirror_ui/faqbot.js
}

function displaySpeechGrader() {
    console.log("[execute] displaySpeechGrader()");
    startSpeechGrader(); // in ../amadeus/mirror_ui/speech_grader.js
}

function displayQuestion(question) {
    console.log("[execute] displayQuestion(question)");
    startQuestion(question);
}

function displayCountdown(text, duration) {
    console.log("[execute] startCountdown(text, duration)");
    startCountdown(text, duration);
}

function displayLoading() {
    console.log("[execute] displayLoading()");
    startLoading();
}

function displayGrades(grades) {
    console.log("[execute] displayGrades(grades)");
    startGrades(grades);
}

function displayNotification() {
    console.log("[execute] displayNotification()");
    startNotification();
}

function removeNotification() {
    console.log("[execute] removeNotification()");
    stopNotification();
}

function displayNotificationContent(notification, date) {
    console.log("[execute] displayNotificationContent(notification, date)");
    startNotificationContent(notification, date);
}

function removeNotificationContent() {
    console.log("[execute] removeNotificationContent()");
    stopNotificationContent();
}

function displaySchoolEvents(num, scrollInterval) {
    console.log("[execute] displaySchoolEvents()");
    $("head").append(`<link rel="stylesheet" href="../modules/school_events/school_events.css" id="style-school-events">`);
    let eventTableHtml = `<table class="events-table"><caption>Recent Events</caption>`;
    for (let i = 0; i < num; i++) { eventTableHtml += `<tr><td><img/></td><td></td></tr>`; }
    eventTableHtml += `</table>`;
    $(".block.bottom.left").html(eventTableHtml).fadeIn("slow");

    schoolEvents.startSchoolEvents(events => {
        let eventIdx = 0, _emojiIdx = emojiIdx;
        // display each event
        let eventsDisplayed = events.slice(0, num);
        $(".events-table tr").each(function() {
            $(":nth-child(1)", this).find("> img").attr("src",
                "../modules/school_events/events_emojis_png/" +
                eventsEmojis[(_emojiIdx++) % eventsEmojis.length] + ".png");
            $(":nth-child(2)", this).html(eventsDisplayed[eventIdx++]);
        });
    });

    // schedule scrolling event emojis
    emojiScrollHandler = setInterval(_ => {
        emojiIdx = (++emojiIdx) % eventsEmojis.length;
        let _emojiIdx = emojiIdx;
        $(".events-table td:nth-child(1)").each(function() {
            $("> img", this).fadeOut('slow', function() {
                $(this).attr("src",
                "../modules/school_events/events_emojis_png/" +
                eventsEmojis[(_emojiIdx++) % eventsEmojis.length] + ".png").fadeIn("slow");
            });
        });
    }, scrollInterval);
}

function removeSchoolEvents() {
    console.log("[execute] removeSchoolEvents()");
    schoolEvents.stopSchoolEvents(_ => {
        $(".block.bottom.left").fadeOut("slow", function() {
            $(this).empty();
            $("head").find("link#style-school-events").remove();
            clearInterval(emojiScrollHandler);
            emojiScrollHandler = 0;
            emojiIdx = 0;
        });
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

ipc.on("display-FAQbot", _ => {
    console.log("[renderer] received display-FAQbot");
    displayFAQBot();
});

ipc.on("remove-FAQbot", _ => {
    console.log("[renderer] received remove-FAQbot");
    stopFAQBot();
});

ipc.on("show-answer", (_, answer) => {
    console.log(`[renderer] received show-answer: ${answer}`);
    displayAnswer(answer);
});

ipc.on("display-speechgrader", _ => {
    console.log("[renderer] received display-speechgrader");
    displaySpeechGrader();
});

ipc.on("show-question", (_, question) => {
    console.log(`[renderer] received show-question: ${question}`);
    displayQuestion(question);
});

ipc.on("show-countdown", (_, text, duration) => {
    console.log(`[renderer] received show-countdown: ${text}, ${duration}`);
    displayCountdown(text, duration);
});

ipc.on("show-loading", _ => {
    console.log("[renderer] received show-loading");
    displayLoading();
});

ipc.on("show-grades", (_, ...grades) => {
    console.log("[renderer] received show-grades");
    displayGrades(grades);
});

ipc.on("display-notification", _ => {
    console.log("[renderer] received display-notification");
    displayNotification();
});

ipc.on("remove-notification", _ => {
    console.log("[renderer] received remove-notification");
    removeNotification();
});

ipc.on("show-notification-content", (_, notification, date) => {
    console.log("[renderer] received show-notification-content");
    displayNotificationContent(notification, date);
});

ipc.on("remove-notification-content", _ => {
    console.log("[renderer] received remove-notification-content");
    removeNotificationContent();
});

ipc.on("display-school-events", _ => {
    console.log("[renderer] received display-school-events");
    displaySchoolEvents(3, 3 * 1000); // set # of events displayed & scrollInterval
});

ipc.on("remove-school-events", _ => {
    console.log("[renderer] received remove-school-events");
    removeSchoolEvents();
});

ipc.on("display-text", (_, text) => {
    console.log(`[renderer] received display-text: ${text}`);
    displayText(text);
});
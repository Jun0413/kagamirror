const request = require('request');
const cheerio = require('cheerio');
const url = 'http://www.eee.ntu.edu.sg/NewsnEvents/Pages/Events.aspx';

let events = [];
let updateEventHandler = 0;

function getNewEvents(display) {
    request(url, (err, _, html) => {
        if (err) {
            return console.log(err);
        }
        let $ = cheerio.load(html);
        $('span.newstitle').each((_, ele) => {
            events.push(ele.children[0].data.replace(/\u200B/g, '').trim());
        });
        console.log("school events retrieved", events);
        display(events);
    });
}

function updateEvents(display, interval) {
    updateEventHandler = setInterval(_ => {
        getNewEvents(display);
    }, interval);
}

exports.startSchoolEvents = (display) => {
    getNewEvents(display);
    updateEvents(display, 3000000); // interval to update event list
}

exports.stopSchoolEvents = (remove) => {
    clearInterval(updateEventHandler);
    updateEventHandler = 0;
    remove();
}
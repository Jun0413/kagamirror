const request = require("request");
const quotesEndpoint = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";

let sampleQuote = "Truly elegant design incorporates top-notch functionality into a simple, uncluttered form.  &mdash;David Lewis";
let quoteHandler = 0;
let quoteHTML = "";
let today = (new Date()).getDate();

function updateQuote(display) {
    request(quotesEndpoint, (err, response, body) => {
        if (err) {
            console.log(err);
            return;
        }
        body = JSON.parse(body);
        let content = body[0].content;
        content.trim();
        if (isShortQuote(content)) {
            content = content.replace(/<(\/)?p>/g, "");
            quoteHTML = content + "  &mdash;" + body[0].title;
            console.log(`received quote: ${quoteHTML}`);
            display(quoteHTML);
        }
    });
}

function isNewDay() {
    let newday = (new Date()).getDate();
    if (newday != today) {
        today = newday;
        return true;
    }
    return false;
}

function isShortQuote(quote) {
    if (quote.match(/<p>/g).length > 1) {
        return false;
    }
    if (quote.length > 150) {
        return false;
    }
    return true;
}

exports.startQuotes = (display) => {
    
    // instead of calling update
    // display sample quote to avoid nothin' shows up
    display(sampleQuote);

    quoteHandler = setInterval(_ => {
        if (isNewDay()) {
            updateQuote(display);
        }
        // updateQuote(display);
    }, 3 * 60 * 60 * 1000);
}

exports.stopQuotes = (remove) => {
    clearInterval(quoteHandler);
    quoteHandler = 0;
    remove();
}

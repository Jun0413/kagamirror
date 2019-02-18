const https = require("https");
const FeedMe = require("feedme");

let feeds = [
    {
        name: "New York Times",
        url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
        headlines: [] // e.g. element: { pubdate: datestring, title: "news title" }
    },
    {
        name: "BBC Top Stories",
        url: "https://feeds.bbci.co.uk/news/rss.xml",
        headlines: []
    },
    {
        name: "Channel News Asia",
        url: "https://www.channelnewsasia.com/rssfeeds/8396082",
        headlines: []
    },
    {
        name: "Straits Times",
        url: "https://www.straitstimes.com/news/singapore/rss.xml",
        headlines: []
    }
];

let curFeed, curHeadline;

let toggleHandler = 0, updateHandler = 0;

const numHeadlinesInFeed = 2;

function updateCurPointers() {

    let numFeeds = feeds.length;
    let numHeadlines = feeds[curFeed].headlines.length > numHeadlinesInFeed ? numHeadlinesInFeed : feeds[curFeed].headlines.length;

    curHeadline += 1;
    if (curHeadline >= numHeadlines) {
        curHeadline = 0;
        curFeed += 1;
        if (curFeed >= numFeeds) {
            curFeed = 0;
        }
    }
}

/**
 * Instead of using an index of current headline
 * we return a headline object since it might not exist
 */
function getCurHeadline() {
    let headlines = feeds[curFeed].headlines;
    return headlines.length === 0 ? null : headlines[curHeadline];
}

function toggleDisplay(display) {
    updateCurPointers();
    display(feeds[curFeed].name, getCurHeadline());
    console.log(`displaying headline at curFeed: ${curFeed}, curHeadline: ${curHeadline}`);
}

function updateFeeds(startIndex, display) {

    if (startIndex >= feeds.length) {
        return;
    }

    let isLast = startIndex === feeds.length - 1;

    let startFeed = feeds[startIndex];

    https.get(startFeed.url, res => {
        if (res.statusCode !== 200) {
            console.error(new Error(`unable to get feeds: statusCode ${res.statusCode}`));
            return; // stop updating headlines for this element
        }

        // empty all the feeds
        while (startFeed.headlines.length > 0) {
            startFeed.headlines.pop();
        }

        let parser = new FeedMe(true);

        parser.on("item", item => {
            if (item.pubdate && item.title) {
                startFeed.headlines.push({
                    pubdate: item.pubdate,
                    title: item.title
                });
            }
        });

        res.pipe(parser);

        parser.on("end", _ => {

            // parser.done();

            if (isLast) {
                console.log("feeds collected: ", feeds);

                //start toggle process
                console.log("start toggle process");
                toggleDisplay(display);
                toggleHandler = setInterval(_ => {
                    toggleDisplay(display);
                }, 5000);

            } else {
                updateFeeds(++startIndex, display);
            }

        });
    });
}

function updateFeedsWrapperFunc(display) {

    console.log("time to update feeds");

    // clear toggle process
    console.log("clear toggle process");
    clearInterval(toggleHandler);
    toggleHandler = 0;
    curFeed = 0;
    curHeadline = -1;

    // do the actual update
    console.log("do actual update");
    updateFeeds(0, display);

}

exports.displayHeadlines = (display) => {

    updateFeedsWrapperFunc(display);
    updateHandler = setInterval(_ => {
        updateFeedsWrapperFunc(display);
    }, 300000);

    // updateFeeds(0, display);
    //console.log(feeds[curFeed].name);
    //console.log(feeds[curFeed].headlines.length);
    //display(feeds[curFeed].name, getCurHeadline());
    //updateCurPointers();

};

exports.stopHeadlines = (remove) => {

    //TODO: order of clearing?
    clearInterval(updateHandler);
    clearInterval(toggleHandler);

    updateHandler = 0;
    toggleHandler = 0;

    remove();
};
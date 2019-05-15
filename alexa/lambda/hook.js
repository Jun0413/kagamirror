const http = require('http');

let options = {
    host: 'kagamirror.serveo.net',
    port: '80',
    path: '/showAnswer',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

exports.handler = function (event, context, callback) {
    console.log("Input:", JSON.stringify(event, null, 2));
    
    let req = http.request(options, function(res) {
        res.on('error', e => {
            console.log('[Error] fail to post to external API: ', options.host);
        });
    });
    
    req.write(JSON.stringify(event), null, 2);
    req.end();

    callback(null, event);
};
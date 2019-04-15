const express = require('express');
const bodyParser = require('body-parser');

const routes = require(`${__dirname}/routes/routes.js`);
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

let server = app.listen(3000, function() {
    console.log('app running on port ', server.address().port);
});

let appRouter = function(app) {
    app.get('/', (_, res) => {
        res.status(200).send('Welcome to RESTful APIs');
    });

    app.post('/showAnswer', (req, res) => {
        console.log(req.body.res.message); // log received json
        res.set('Content-Type', 'text/plain');
        res.end("yes"); // echo response text
    });

};

module.exports = appRouter;
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.use(cors());
app.use(morgan('tiny'));

function getResults(body){
    const $ = cheerio.load(body);
}

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.get('/schedule', (req, res) => {
    const url = 'http://ontariopowerlifting.org/event/';
    fetch(url)
     .then(res => res.text())
     .then(body => {
        const results = getResults(body);
        res.json({
            results
        });
    });
});

app.use((req, res, next) => {
    const err = new Error('Not found');
    res.status(404);
    next(err);
});

app.use((err, req, res, next) => {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message
    });
});

app.listen(8000, () => {
    console.log('Listening on port 8000');
});
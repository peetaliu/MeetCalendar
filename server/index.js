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
    const meets = $('[id^=post-]');   
    let meetArr = [];

    meets.each((index, element) => {
        const result = $(element);
        const meetName = result.find('.tribe-events-list-event-title').text().trim();
        const meetDate = result.find('.tribe-event-schedule-details').text().trim();
        const meetCost = result.find('.tribe-events-event-cost').text().trim();
        const meetVenue = result.find('.tribe-events-venue-details').text();
        const meetVenueF = meetVenue.substr(0, meetVenue.indexOf(',')).trim();
        const meetStreet = result.find('.tribe-street-address').text().trim();
        const meetCity = result.find('.tribe-locality').text().trim();
        const meetPost = result.find('.tribe-postal-code').text().trim();
        const meetSummary = result.find('.tribe-events-list-event-description').text().trim();
        console.log(meetName, meetDate, meetCost, meetVenueF, meetStreet, meetCity, meetPost, meetSummary);
        meetArr.push({
            meetName,
            meetDate,
            meetCost,
            meetVenueF,
            meetStreet,
            meetCity,
            meetPost,
            meetSummary
        });
    });

    return meetArr;
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
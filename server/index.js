const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.use(cors());
app.use(morgan('tiny'));

function formatVenue(venueText){
    const formatted = venueText.substring(0, venueText.indexOf(','));
    return formatted;
}

function getResults(body){
    const $ = cheerio.load(body);
    const meets = $('[id^=post-]');   
    let meetArr = [];

    meets.each((index, element) => {
        const result = $(element);
        const meetInfo = {
            name : result.find('.tribe-events-list-event-title').text().trim(),
            date : result.find('.tribe-event-schedule-details').text().trim(),
            cost : result.find('.tribe-events-event-cost').text().trim(),
            venue : formatVenue(result.find('.tribe-events-venue-details').text().trim()),
            street : result.find('.tribe-street-address').text().trim(),
            city : result.find('.tribe-locality').text().trim(),
            post : result.find('.tribe-postal-code').text().trim(),
            summary : result.find('.tribe-events-list-event-description').text().trim()
        }
        console.log(meetInfo.name, meetInfo.date, meetInfo.venue);
        meetArr.push(meetInfo);
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
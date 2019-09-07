// server.js

var express         = require('express');
var fs              = require('fs-extra');
var router          = express.Router();
var airshopping     = require('./airshopping')
var flights         = require('./flights')
var cities          = require('./cities')
var airlineprofile  = require('./airlineprofile')
var bodyParser      = require('body-parser');
var app             = express();
const db            = require('./db');
require('body-parser-xml')(bodyParser);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// this will let us get the data from a POST, JSON and XML
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.xml());
app.use(bodyParser.json());

var port = 8080;  // set our port

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Athena Airways API!' });   
});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
app.use('/flights', flights);
app.use('/cities', cities);
app.use('/airshopping', airshopping)
app.use('/airlineprofile', airlineprofile)

// START THE SERVER
app.listen(port, () => {
  console.log('Magic happens on port ' + port);
});



var express = require('express');
var router = express.Router();
//const xml2js = require('xml2js');
const FLIGHT = require('../../modules/flight');
//const REQUEST = require('../../controllers/request.js');
const reqCont = require('../../controllers/query.js');


router.post('/oneway',reqCont.oneway);

router.get('/roundtrip',reqCont.twoWayFlights);

module.exports = router;
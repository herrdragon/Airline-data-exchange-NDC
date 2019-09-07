// cities.js

var express    = require('express');
var router     = express.Router();
var builder    = require('xmlbuilder');
const db       = require('./db');

module.exports = router;

router.get('/', async (request, response) => {
  response.set('Content-Type', 'application/xml');
  let cities = await db.pool.query(`(SELECT * FROM airport)`);
  let count = cities.rowCount;
  cities = cities.rows;
  response.send(buildresponse(count, cities));
});

function buildresponse(count, data) {
    var xml = builder.create('Response', {encoding: 'utf-8'})
    .ele('Cities');
      for(var i = 0; i < count; i++) {
        var item = xml.ele('city');
        item.att('id', data[i].id);
        item.att('iata_code', data[i].iata_code);
        item.att('name', data[i].city);
      }
    return (xml.end({pretty: true}));
}

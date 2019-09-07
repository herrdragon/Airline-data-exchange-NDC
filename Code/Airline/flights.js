// flights.js

var express    = require('express');
var router     = express.Router();
const db       = require('./db');

module.exports = router;

router.post('/', async (request, response) => {
  const depart = request.body.fromcity.split('-')[0];
  const dest = request.body.tocity.split('-')[0];
  const departDate = new Date(request.body.departDate);
  const returnDate = new Date(request.body.returnDate);
  let departday = dayofweek(departDate);
  let returnday = dayofweek(returnDate);
  if(depart && dest && departDate && returnDate) {
    let goflights = await db.pool.query(`SELECT * FROM flight WHERE departs=$1 AND arrives=$2 AND dow LIKE $3`,[depart, dest, '%'+departday+'%']);
    let backflights = await db.pool.query(`SELECT * FROM flight WHERE departs=$1 AND arrives=$2 AND dow LIKE $3`,[dest, depart, '%'+returnday+'%']);
    goflights = goflights.rows;
    backflights = backflights.rows;
    let data = {goflights, backflights};
    response.send(data);
  }
  else {
    response.send("400 - Bad request: Error in query");
  }
});

function dayofweek(date) {
    return date.getDay() == 0 ? 7 : date.getDay();
}


// airlineprofile.js

var express    = require('express');
var router     = express.Router();
var builder    = require('xmlbuilder');
const db       = require('./db');

module.exports = router;

router.post('/', async (request, response) => {
	response.set('Content-Type', 'application/xml');
    try {
        let req = request.body;
        let airlineCode = req.IATA_AirlineProfileRQ.Party[0].Recipient[0].ORA[0].AirlineDesigCode[0];
        let tAgency = req.IATA_AirlineProfileRQ.Party[0].Sender[0].TravelAgency[0];
        let ownerCode = req.IATA_AirlineProfileRQ.Request[0].AirlineProfileFilterCriteria[0].AirlineProfile[0].OwnerCode[0]
        let profile = [airlineCode,tAgency.AgencyID[0],tAgency.IATANumber[0],tAgency.Name[0],ownerCode];
        let action = 'Response';
        try {
            let agent = await db.pool.query(`SELECT * FROM t_agent WHERE agency_id=$1 AND iata_id=$2`,[tAgency.AgencyID, tAgency.IATANumber]);
            if(agent.rowCount < 1) {
                let result = await db.pool.query(`INSERT INTO t_agent(agency_name,agency_id,iata_id,airline_code) VALUES($1,$2,$3,$4)`, [tAgency.Name[0],tAgency.AgencyID[0],tAgency.IATANumber[0],ownerCode[0]]);
                if(result) action = 'Create';
            }
        } catch(e) {}
    
        response.send(buildresponse(action));
    } catch(e) {}
});

function buildresponse(action) {
    var xml = builder.create('IATA_AirlineProfileRS', {encoding: 'utf-8'})
        .ele('Response')
            .ele('AirlineProfile')
                .ele('AirlineProfileDataItem')
                    .ele('ActionTypeCode', action).up()
                    .ele('OfferFilterCriteria')
                    	.ele('DirectionalIndText', 3).up()
                    	.ele('OfferDestPoint').ele('IATALocationCode', 'LHR').up().up()
                    	.ele('OfferDestPoint').ele('IATALocationCode', 'GVA').up().up()
                	.up()
            		.ele('SeqNumber', 1).up()
					.ele('ServiceCriteria')
				    	.ele('RFISC', '0CC').up()
					.up()
					.ele('ServiceCriteria')
				    	.ele('RFISC', '0BX').up()
				.up()
            	.ele('ProfileOwner')
		    		.ele('AirlineDesigCode', 'A9').up()
		    	.up()
		    .up()
		.up()
    .up()
    .end({ pretty: true});
    return xml;
}

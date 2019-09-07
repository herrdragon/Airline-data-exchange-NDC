const Qrs = require('../modules/query');
const REQUEST = require('./request');
const airShoppingRQ = require('../xml_schemas/airShoppingRQ');
const modifyDate = require('../utils/dates');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({stdTTL:1200});


exports.twoWayFlights = (req,res,next) =>{
    var arrivalFlight;
    var departureFlight;
    const REQ = req.query;
    const depart = Qrs.find({request: 'gg'},(err,result)=>{
        if(err){
            console.log(err);
        }
        if(!result.length){

        }
    });
    const arrive = Qrs.find({request: 'hello'},(err,result)=>{
        if(err){
            console.log(err);
        }
        if(!result.length){
            
        }
    });

    depart.then((document)=>{
        departureFlight = document;
    }).then(()=>{
        arrive.then((document)=>{
            arrivalFlight = document;
        }).then(()=>{
            res.status(200).json({
                departure: departureFlight,
                arrival: arrivalFlight
            })
        });
    });
}

exports.oneway = (req,res,next) =>{
    var fetchedFlights;
    var xmlReq;
    var date;
    var REQ;
    try {
        let Req = req.body;
        let dep = Req.Request.FlightCriteria[0].OriginDestCriteria[0].OriginDepCriteria[0].IATALocationCode[0];
        let dest = Req.Request.FlightCriteria[0].OriginDestCriteria[0].DestArrivalCriteria[0].IATALocationCode[0];
        date = Req.Request.FlightCriteria[0].OriginDestCriteria[0].OriginDepCriteria[0].Date[0];
        //day = new Date(date);
        //let paxId = Req.Request.Paxs[0].Pax[0].PaxID[0];
        //let ptc = Req.Request.Paxs[0].Pax[0].PTC[0];
        //let airCode = Req.Request.ShoppingCriteria[0].CarrierCriteria[0].Carrier[0].AirlineDesigCode[0];
        //let cabinType = Req.Request.ShoppingCriteria[0].FlightCriteria[0].CabinType[0].CabinTypeCode[0];
        //let r = [dep,dest,date,paxId,ptc,airCode,cabinType];
        REQ=dep+dest+date;
        let read ={
            arrival: dest,
            departure: dep
        }
        xmlReq=airShoppingRQ.airShoppingRQ(read, date);
    } catch(e) {
        console.log(e);
        xmlReq=undefined;
    }
    var inCache = myCache.get(REQ);
    if(xmlReq==undefined){
        res.status(404).send({
            Error: 'Page not found.'
        });
    }
    else if(inCache==undefined){
        console.log('not in cache');
        const cueri = Qrs.find({request: REQ},(err,result)=>{
            if(err){
                console.log(err);
            }
            if(!result.length){

                console.log('Request not found. Fetching flights...');
                fetchFlights(xmlReq,date,REQ,(response)=>{
                    res.send(response);
                });

            }
        }).lean()
        .then((document)=>{
            if(Object.keys(document).length){
                console.log('in database.');
                if((Date.now()-document[0].queryDate)>604800000){ //This number representes 7 days.
                    console.log('The data is staled. Fetiching flights...');
                    console.log(req.body); //Here the data is supposed to be updated.
                    //Qrs.findOneAndDelete({request: document[0].request});
                    //document[0].remove();
                    fetchFlights(xmlReq,date,REQ,(response)=>{
                        res.send(response);
                    });
                }
                else{
                    fetchedFlights=document[0].flights;
                    myCache.set(REQ,fetchedFlights,(err)=>{
                        if(err){
                            console.log(err);
                        }
                    });
                    res.send(fetchedFlights);
                }
            }
        }).catch((error)=>{
            console.log(error);
        });
    }
    else{
        console.log('in cache');
        res.send(inCache);
    }
}

const fetchFlights = (oneWayXmlRQ,modifiedDepDate,id,callback) =>{
    REQUEST.httpRQ(oneWayXmlRQ,modifiedDepDate,(response)=>{
        var newQuery = new Qrs({
            request: id,
            queryDate: Date.now(),
            flights: response
        });
        newQuery.save((error)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log('Query saved.');
            }
        });
        callback(response);
        myCache.set(id,response,(err)=>{
            if(err){
                console.log(err);
            }
        });
    });
}
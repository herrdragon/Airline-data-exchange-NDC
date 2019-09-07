const http = require('http');
const urls = require('../public/URLS/urlsheet.js');
const xml2js = require('xml2js');
const request = require('request');

var url = urls.ip;
const parser = new xml2js.Parser();

//Make multiple requests to the airlines urls.
exports.httpRQ = (bodyXML, dep_date,callback)=>{
    var count =0;
    var returnFlights=[];
    var count=0;
    for(var i=0;i<url.length;i++){
        var options = { method: 'POST',
        url: url[i]+'/airshopping',
        headers: {  'cache-control': 'no-cache',
                    'Content-Type': 'application/xml' },
        body: bodyXML
        };
        
    console.log(url[i]);
        request(options,  (error, response, body)=>{
            if (error) throw new Error(error);
            returnFlights+=(body);//.replace('/<\? xml .*\?>/', ''));
            count++;
            if(count==url.length){
                callback(returnFlights);
            }
        });
    }
}
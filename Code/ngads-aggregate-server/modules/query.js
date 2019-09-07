const mongoose = require('mongoose');
const FLIGHT = require('./flight');

const querySchema = mongoose.Schema({
    request: {
        type: String,
        required: true
    },
    queryDate: {
        type: String,
        required: true
    },
    flights:{
        type: String
    }/*,
    stale:{
        type: Boolean,
        required: true
    }*/
});

module.exports = mongoose.model('Qrs',querySchema);
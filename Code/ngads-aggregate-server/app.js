const createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var index = require('./routes/index.js');
var mongoose = require('mongoose');
var DB = require('./routes/api/query');
require('body-parser-xml')(bodyParser);
var pas = 'mongodb://localhost:27017/flights';

var app = express();

mongoose.connect(pas,{useNewUrlParser: true})
.then(()=>{
    console.log('Connection succesful');
}).catch(()=>{
    console.log('Failure');
});

app.use(bodyParser.xml());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/',index);
app.use('/flight',DB);

app.use((req, res, next)=>{
    next(createError(404));
});
// error handler
app.use((err, req, res, next)=>{
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports=(app);
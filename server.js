//Create a db connection string

var db = 'mongodb://heroku_mzmrmrxg:mmi4drk3pj9v3878t3v593qf6t@ds239439.mlab.com:39439/heroku_mzmrmrxg';

//Create a port for server to listen on

var port = process.env.PORT || 8000;

// Load in router

var router = require('./routes/api');

// Load in node modules

var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');


//Create an express application

var app = express();

//Load in environment variables

dotenv.config({ verbose: true});

// Connect to Mongo

mongoose.connect(db, function(err) {
    if(err) {
        console.log(err);
    }
});

// Listen to mongoose connection events

mongoose.connection.on('connected', function() {
    console.log('Successfully opened a connection to ' + db);
});

mongoose.connection.on('disconnected', function() {
    console.log('Successfully disconnected from ' + db);
});

mongoose.connection.on('error', function() {
    console.log('An error has occured connecting to ' + db);
});

// Node process event to fire upon manual shutdown of application

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose default connection disconnected through application termination');
        process.exit(0);
    });
});

// Node process event to fire on forced termination of aplication

process.on('exit', function(code) {
    console.log('Node process closed with a code of ' + code);
});

// Configure express middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use('/api', router);
app.get("*", function (req, res){
    res.sendFile(__dirname + '/public/index.html');
});

//Start up our server

app.listen(port, function() {
    console.log('Listening on ' + port);
});

//console.log(process.env.secret);
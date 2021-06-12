
var express = require('express');
var session = require('express-session');
var app = express();
var fs = require("fs");


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// use that dependencies
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true
}));


////////////////////////////////////////////////Phase 1/////////////////////////////////////////////////////////////
MongoClient.connect(url, function(err, db) {
  var destinations;
  if (err) throw err;

app.get("/messagedata", (req, res) => {
  var dbo = db.db("vishwasdb");
  var collection = dbo.collection("message");

  collection.find({}, {txtdata: 1} ).sort({_id:-1}).limit(1).toArray((error, result) => {
    if(error) {
        return res.status(500).send(error);
    }
    //res.send(result);
     destinations = result;
    var count = req.query.count != undefined ? req.query.count : req.query.count = 100;
    if(req.query.country){
        var countrySpots = destinations.filter(function(destinations) {
            return destinations.country == req.query.country
        });
        res.end(JSON.stringify(countrySpots.slice(0, count)));
    }
    res.end(JSON.stringify(destinations.slice(0, count)));
});

});



//=============================================================

app.post('/sendtodisplay', function (req, res) {
  console.log("data flag from device");
  var destinations;
    var newDestination = {
        "api_key": req.body.api_key,
        "txtdata" : req.body.txtdata,
    }
    //destinations.push(newDestination);
    console.log(newDestination);
    res.status(201).end(JSON.stringify(newDestination));
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
       var dbo = db.db("vishwasdb");
        var myobj = { txtdata: req.body.txtdata};
      // var myobj = destinations;
      dbo.collection("message").insertOne(myobj, function(err, res) {
         if (err) throw err;
        console.log("1 document inserted");
      });
    });
})

});



// A promo message to user
var message = "this is voice based notice board server";

app.get('/messages', function (req, res) {
    res.end(JSON.stringify(message));
})







// Home Page
app.get('/', (req, res) => res.send('Welcome! to voice notice Server'))

// // Configure server
// var server = app.listen(9000, '192.168.2.3', function (req, res) {
//
//     var host = server.address().address
//     var port = server.address().port
//
//     console.log(`Server running at http://${host}:${port}/`);
// })

//////////////////////////////Over the Internet ///////////////////////////////////////////

const PORT = process.env.PORT || 8051;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
////////////////////////////////////////////////////////////////////////////////

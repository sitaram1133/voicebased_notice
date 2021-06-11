var express = require('express');
 var session = require('express-session');
var nodemailer = require('nodemailer');
var app = express();
var fs = require("fs");

const SMS = require('node-sms-send')
const sms = new SMS('akshayk999@gmail.com', 'Akshay8051')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
//var url = "mongodb+srv://AkshayDigital:Akshay8051@vishwasdb.mx0hv.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";


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

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vishwas8051@gmail.com',
    pass: 'Akshay8051'
  }
});

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

////////////////////////////////////////////////product session  1/////////////////////////////////////////////////////////////
MongoClient.connect(url, function(err, db) {
  var destinations;
  if (err) throw err;
   var dbo = db.db("GrowUp");
   var collection = dbo.collection("productlist");
   app.get("/productlist", (req, res) => {
   collection.find({}).toArray((error, result) => {
       if(error) {
           return res.status(500).send(error);
       }
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
    //db.close();
});



app.post('/productlist', function (req, res) {
  console.log("One product Added");
  var index = 5;
  var destinations;
    var newDestination = {
        "id":req.body.id,
        "title": req.body.title,
        "type": req.body.type,
        "Unit": req.body.Unit,
        "imgurl": req.body.imgurl,
        "stockinfo": req.body.stockinfo,
        "sale": req.body.sale,
        "price": req.body.price
    }
    index++;
    //destinations.push(newDestination);
    console.log(newDestination);
    res.status(201).end(JSON.stringify(newDestination));
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
       var dbo = db.db("productlist");

        var myobj = {  "id":req.body.id,
        "title": req.body.title,
        "type": req.body.type,
        "Unit": req.body.Unit,
        "imgurl": req.body.imgurl,
        "stockinfo": req.body.stockinfo,
        "sale": req.body.sale,
        "price": req.body.price };

      // var myobj = destinations;
      dbo.collection("userinfo").insertOne(myobj, function(err, res) {
         if (err) throw err;
        console.log("1 document inserted");
        

      //  db.close();
      });
    });
})
});



/////////////////////////////////////////////////// Phase 2 //////////////////////////////////////////////////////////

MongoClient.connect(url, function(err, db) {
var checkout;
 if (err) throw err;
app.get("/checkout/:phone", (req, res) => {
  var phonenum = req.params.phone;
  console.log(phonenum);
});
app.get("/checkout", (req, res) => {
  var checkout;
    //console.log(phonenum);
    var phones = "9822225032"
  var dbo = db.db("VishwasCorpData");
  var collection = dbo.collection(phones);
   collection.find({}).toArray((error, result) => {
       if(error) {
           return res.status(500).send(error);
       }
       checkout = result;
       var count = req.query.count != undefined ? req.query.count : req.query.count = 100;
       if(req.query.country){
           var countrySpots = checkout.filter(function(checkout) {
               return checkout.country == req.query.country
           });
           res.end(JSON.stringify(countrySpots.slice(0, count)));
       }
       res.end(JSON.stringify(checkout.slice(0, count)));
   });
   //db.close();
});

app.get("/calculation", (req, res) => {
  var checkout;
    //console.log(phonenum);
    var phones = "9822225032"
  var dbo = db.db("VishwasCorpData");
  var collection = dbo.collection(phones);
   collection.find({}).toArray((error, result) => {
       if(error) {
           return res.status(500).send(error);
       }
       console.log(result.price);
       checkout = result;
       var count = req.query.count != undefined ? req.query.count : req.query.count = 100;
       if(req.query.country){
           var countrySpots = checkout.filter(function(checkout) {
               return checkout.country == req.query.country
           });
           res.end(JSON.stringify(countrySpots.slice(0, count)));
       }
       res.end(JSON.stringify(checkout.slice(0, count)));
   });
   //db.close();
});

/////////////////////////////////// Payment API integration ////////////////////////////////////////////////
app.post('/payment', function (req, res) {
  var index = 5;
  var destinations;
    var newDestination = {
        "title": req.body.title,
        "phone": req.body.phone,
        "address" : req.body.address,
        "total": req.body.total,
        "paytype": req.body.paytype,
        "fulladd":req.body.fulladd,
        "receiver":req.body.receiver,
        "receiverphone":req.body.receiverphone,
        "landmark":req.body.landmark,
        "id" : index + 1
    }

    index++;
    console.log(newDestination);
    res.status(201).end(JSON.stringify(newDestination));
    var dbo = db.db("vishwasdb");
        var myobj = { title: req.body.title,
          phone: req.body.phone,
          address: req.body.address,
          total: req.body.total,
          paytype: req.body.paytype,
        fulladd: req.body.fulladd,
        receiverphone: req.body.receiverphone,
      landmark: req.body.landmark};

        //payment Gatway proceed
      var paytype  = req.body.paytype;
      var phonenum = req.body.phone;
      if (paytype == "COD") {
    dbo.collection("CODrejected").findOne({}, function(err, result) {
      if (err) throw err;
      if (phonenum == "") {
        console.log("User not applicable");
      }else{
        dbo.collection("order").insertOne(myobj, function(err, res) {
           if (err) throw err;
          console.log("1 document inserted");
        });

      }
    });
}



  });





/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/placeorder", (req, res) => {
  console.log("order placed...");

  // sms.send('+919518592029', 'Thanks!, Your Odrder is being arriving.')
  // .then(body => console.log(body)) // returns { message_id: 'string' }
  // .catch(err => console.log(err.message))

  var phones = "9822225032"
var dbo = db.db("VishwasCorpData");
var collection = dbo.collection(phones);
var collectionB = dbo.collection("masterlist")
collection.aggregate([{$out : "masterdata"}]);
 collection.find({}).toArray((error, result) => {
     if(error) {
         return res.status(500).send(error);
     }
     checkout = result;
     var count = req.query.count != undefined ? req.query.count : req.query.count = 100;
     if(req.query.country){
         var countrySpots = checkout.filter(function(checkout) {
             return checkout.country == req.query.country
         });
         res.end(JSON.stringify(countrySpots.slice(0, count)));
     }
     res.end(JSON.stringify(checkout.slice(0, count)));
     var mailOptions = {
       from: 'vishwas8051@gmail.com',
       to: 'akshaydigital@gmail.com, akshaykolhe8051@gmail.com, abkolhe2@gmail.com',
       subject: 'About Vegitable delivery confirmation',
   ///////////////////////////////////// HTML confirmation mail view ///////////////////////////////////////////
        html : { path: 'form.html'}
        ///////////////////////////////////////////////////////////
     };

           console.log(result);
     transporter.sendMail(mailOptions, function(error, info){
       if (error) {
         console.log(error);
       } else {
         console.log('Email sent: ' + info.response);
       }
     });

 });
 var documentsToMove = collection.find({});
 documentsToMove.forEach(function(doc) {
     collectionB.insert(doc);
     collection.remove(doc);
 });


  var message ="Shree"
    res.end(JSON.stringify(message));
});






//////////////////////////////////////////////////////////////////////////////
app.delete("/checkout/:id", (req, res) => {
  var checkout;
  var dbo = db.db("mydb");
  var collection = dbo.collection("customers");
    collection.deleteOne({ "_id": new ObjectId(req.params.id) }, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
        console.log("1 document deleted");
    });
});
///////////////////////////////////////General messages///////////////////////////////////////////

});



// A promo message to user
var message = "Guru Pornima! Get 100% cachback on saving your first Delivery.";

app.get('/messages', function (req, res) {
    res.end(JSON.stringify(message));
})
//////////////////////////////////////////////product cart Api///////////////////////////////////////////////////



//Create a new Destination and add it to existing Destinations list
app.post('/checkout', function (req, res) {
  var index = 5;
  var destinations;
    var newDestination = {
        "phone": req.body.phone,
        "title": req.body.title,
        "price": req.body.price,
        "stockinfo" : req.body.stockinfo,
        "imgurl" : req.body.imgurl,

        //"id" : req.body.id
        "id" : index + 1
      //  "sale" : req.body.sale
        //"qty": req.body.qty
    }
    index++;
    //destinations.push(newDestination);
    console.log(newDestination);
    res.status(201).end(JSON.stringify(newDestination));
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
       var dbo = db.db("VishwasCorpData");
        var myobj = { title: req.body.title, price: req.body.price, imgurl: req.body.imgurl};
      // var myobj = destinations;
      var phone = req.body.phone;
      console.log(phone);
      dbo.collection(phone).insertOne(myobj, function(err, res) {
         if (err) throw err;
        console.log("1 document insertedd");
        db.close();
      });
    });
})




//////////////////////////////////////////////////////////////////////////////////


//Delete a Destination
app.delete('/checkout/:id', function (req, res) {
    for (var i = 0; i < destinations.length; i++) {
        if(destinations[i].id == req.params.id){
            destinations.splice(i, 1);
            res.status(204).end(JSON.stringify(destinations[i]));
        }
    }
});


// Home Page
app.get('/', (req, res) => res.send('Welcome! You are all set to go!'))

// // Configure server
// var server = app.listen(9000, '192.168.2.3', function (req, res) {
//
//     var host = server.address().address
//     var port = server.address().port
//
//     console.log(`Server running at http://${host}:${port}/`);
// })

//////////////////////////////Over the Internet ///////////////////////////////////////////

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
////////////////////////////////////////////////////////////////////////////////

var mongodb  = require('mongodb');
var ObjectId = mongodb.ObjectID;
var urlDB    = process.env.MONGOLAB_URI;
var db;

var fs       = require('fs');
var express  = require('express');
var app      = express();

app.get('/new/:url*', function(req, res){
    var url  = req.url.substr(5);

    // Check url format
    if(!url.match(/^https?:\/\/([0-9a-z_-]+\.)+[a-z]{2,6}/)) {
        res.send(JSON.stringify({
            error: "Wrong url format, make sure you have a valid protocol and real site."
        }));
        return;
    }

    var collection = db.collection("url");
    var data       = { original_url: url };
    var short_url  = (req.get('x-forwarded-proto') ? 'https' : 'http') + '://' + req.get('host') + '/';

    function respond(doc) {
        var id = doc._id.toHexString();
        data.short_url = short_url + id;
        res.send(JSON.stringify(data));
    }

    // Check if url already as a short version
    collection.findOne({ url: url }, function(err, doc){
        if(err) throw err;
        if(doc) {
            respond(doc);

        // Create a short version
        } else {
            collection.insert({ url: url }, function(err, q){
                if(err) throw err;
                respond(q.ops[0]);
            });
        }
    });
});

app.get('*', function(req, res){
   var query = req.params[0].substr(1);
   if(!query) {
        res.send(JSON.stringify({
            error: "Wrong id."
        }));
       return;
   }
   var collection = db.collection("url");
   collection.findOne({
       _id: ObjectId(query)
   }, function(err, doc){
       if(err) throw err;

       if(doc) {
           res.redirect(doc.url);
       } else {
            res.send(JSON.stringify({
                error: "Wrong id."
            }));
       }
   });
});

mongodb.MongoClient.connect(urlDB, function(err, database){
    if(err) throw err;
    db = database;
    app.listen(process.env.PORT || 8080, function(){
        console.log('The server is listening on port 8080');
    });
});
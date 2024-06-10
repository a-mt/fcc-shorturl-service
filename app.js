var { MongoClient, ObjectId } = require('mongodb');
var urlDB   = process.env.MONGOLAB_URI;
var db;

var fs      = require('fs');
var express = require('express');
var app     = express();

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
    collection.findOne({ url }).then(function(doc){
        if(doc) {
            respond(doc);

        // Create a short version
        } else {
            collection.insertOne({ url }).then(function(q){
                respond(q.ops[0]);
            }).catch(err => {
                console.error(err);
                respond(err);
            });
        }
    }).catch(err => {
        console.error(err);
        respond(err);
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
       _id: new ObjectId(query)
   }).then(function(doc){
       if(doc) {
           res.redirect(doc.url);
       } else {
            res.send(JSON.stringify({
                error: "Wrong id."
            }));
       }
   }).catch(err => {
        console.error(err);
        res.send(JSON.stringify({
            error: "Wrong id."
        }));
   });
});

const mongoClient = new MongoClient(urlDB);

mongoClient.connect().then(function(){
    console.log('Successfully connected to mongo')

    db = mongoClient.db('urlshortener');

    app.listen(process.env.PORT || 8080, function(){
        console.log('The server is listening on port 8080');
    });
});
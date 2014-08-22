var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET Data page. */
router.get('/getData', function(req, res) {
    //oggetto db giusto
    var db = req.db;
    //collezione giusta
    var collection = db.get('performanceCollection');
    //tiro su tutti i dati --- TEST ---
    collection.find({},{},function(e,docs){
        console.log(e);
        res.render('getData', {
            "docs" : docs
        });
    });
});



router.post('/insert', function(req, res) {

    console.log(req.body);

    //creiamo il json giusto
    var performance = {type : req.body.type, java : req.body.java, jni : req.body.jni, rs : req.body.rs, vendor : req.body.vendor, model : req.body.model }

    var db = req.db;

    // prendiamo la collection giusta
    var collection = db.get('performanceCollection');

    // inseriamo a db
    collection.insert(performance, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            res.send("benissimo");
        }
    });

    //se riceviamo i test sulla batteria inseriamo
    if (req.body.battery != '[0, 0, 0]'){

    var battery = {type : req.body.type, battery : req.body.battery , vendor : req.body.vendor, model : req.body.model }

    var collection = db.get('batteryCollection');

         // inseriamo a db
    collection.insert(battery, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            res.send("benissimo");
        }
    });
    }

});

module.exports = router;


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

/* GET insert page. */
router.get('/insertData', function(req, res) {
  res.render('insertData');
});

router.post('/insert', function(req, res) {

    console.log(req.body);
    /*
  // Set our internal DB variable
    var db = req.db;

    // Set our collection
    var collection = db.get('performanceCollection');

    // Submit to the DB
    collection.insert(req.body, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            res.send("benissimo");
        }
    });
*/
});

module.exports = router;


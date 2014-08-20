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

module.exports = router;


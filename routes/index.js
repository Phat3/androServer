var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

    var db = req.db;

    var perfCollection = db.get('performanceCollection');


    //prendiamo i valori dstinti in base al modello
    perfCollection.distinct('model', function(e, docs){
        //res.render('index', { title: 'Express', models: docs });

        var java = []
        var jni = []
        var rs = []

        console.log(docs)


        docs.forEach(function(value, key){
            console.log(value)

            //scorro per ogni record del modello
            perfCollection.find( { model : value }, function(e, documents){


                    var count = 0;
                    var sumJava = 0;
                    var sumRs = 0;
                    var sumJni = 0;

                    documents.forEach(function(val){

                        var valoriJava = (val.java.replace('[','').replace(']','').split(','));
                        var valoriJni = (val.jni.replace('[','').replace(']','').split(','));
                        var valoriRs = (val.rs.replace('[','').replace(']','').split(','));

                        sumJava += parseInt(valoriJava[0])
                        sumJni += parseInt(valoriJni[0])
                        sumRs += parseInt(valoriRs[0])
                        count ++;

                   })

                   console.log(count);
                   java.push(sumJava/count)
                   jni.push(sumJni/count)
                   rs.push(sumRs/count)
                   console.log('la lunghezza e ' + docs.length)
                   console.log('la chiave e ' + key)
                   console.log(key === docs.length)
                  if (key === (docs.length - 1)){
                    res.render('index', { title: 'Express', models: docs, java : java, jni: jni, rs : rs });
                  }
            })

        })



    })




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

router.get('/insertData', function(req, res){
    res.render('insertData')
})


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
        console.log('entrato')
    var battery = {type : req.body.type, battery : req.body.battery , vendor : req.body.vendor, model : req.body.model }
    console.log(battery);
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


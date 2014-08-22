var express = require('express');
var router = express.Router();

// rotta che disegna il grafico di performance e batteria nel caso base (grayscale piu piccolo)
router.get('/', function(req, res) {

    var db = req.db;

    var perfCollection = db.get('performanceCollection');

    //ricavo i modelli distinti
    perfCollection.distinct('model', { type : 'gray' }, function(e, docs){

        //array da ritornare opportunamente riempiti
        var java = []
        var jni = []
        var rs = []
        var models = []

        //scorro tra tutti i modelli distinti
        docs.forEach(function(value, key){

            //ricavo tutti i record che hanno come modello quello specficato
            perfCollection.find( { model : value, type : 'gray' }, function(e, documents){

                    //inizializzo le variabli di calcolo
                    var count = 0;
                    var sumJava = 0;
                    var sumRs = 0;
                    var sumJni = 0;
                    models.push(documents[0].vendor + ' ' + docs[key])


                    //scorro per ogni record e incremento il cotatore e somma
                    documents.forEach(function(val){

                        //ricavo i valori dagli oggetti ( FA SCHIFO)
                        var valoriJava = (val.java.replace('[','').replace(']','').split(','));
                        var valoriJni = (val.jni.replace('[','').replace(']','').split(','));
                        var valoriRs = (val.rs.replace('[','').replace(']','').split(','));

                        //continuo a somare e ad incrementare il contatore fino a che ho risultati
                        sumJava += parseInt(valoriJava[0])
                        sumJni += parseInt(valoriJni[0])
                        sumRs += parseInt(valoriRs[0])
                        count ++;

                   })

                    //riempio gli array con i dati calcolati in base alla media
                       java.push(sumJava/count)
                       jni.push(sumJni/count)
                       rs.push(sumRs/count)

                   //se ho finito (le query a mongo db sono asincrone quindi non aspetta la fine a fare il render della pagina)
                  if (key === (docs.length - 1)){
                    res.render('index', { models: models, java : java, jni: jni, rs : rs });
                  }
            })


        })

        //caso in cui si abbiano 0 risultati, ci sarebbe un caricamento infinito altrimenti
        if (docs.length == 0){
                res.render('index', { models: models, java : java, jni: jni, rs : rs });
        }

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


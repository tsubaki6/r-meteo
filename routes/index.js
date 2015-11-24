var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('local')
var mycollection = db.collection('test')

/* GET home page. */
router.get('/', function(req, res, next) {
res.render('index', { title: 'Express'});
});

router.post('/',function(req,res, next){
    db.collection('forecast').insert(req.body);
    res.send({})
})

router.get('/forecast', function(req,res,next){
db.collection('forecast').find(function (err, docs) {
 res.send(docs);
})
})
module.exports = router;


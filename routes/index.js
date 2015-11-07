var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
//var Test = mongoose.model('Test');
var db = mongojs('local')
var mycollection = db.collection('test')
/* GET home page. */
//router.get('/', function(req, res, next) {
//  //res.render('index', { title: 'Express' });
//  mycollection.find(function (err, data) {
//      // docs is an array of all the documents in mycollection
//      console.log(data);
//  })
//});

//router.post('/forecast', function(req,res,next){
// db.collection('forecast').insert(req.body);
//})
//router.get('/forecast', function (req, res,next) {
//db.collection('forecast').insert(req.body);
//console.log(next)
//  res.send('about');
//});
//router.get('/test', function(req, res, next) {
//  Test.find(function(err, test){
//    if(err){ return next(err); }
//
//    res.json(test);
//  });
//});
module.exports = router;

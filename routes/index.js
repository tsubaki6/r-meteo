var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('local')
var mycollection = db.collection('test')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/',function(req,res, next){
    db.collection('forecast').insert(req.body);
})
module.exports = router;


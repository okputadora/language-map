var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/map', function(req, res, next){
  res.render('map')
})
router.post('/submit', function(req, res, next){
  var word = req.body.word;
  res.redirect('/scrape/' + word);
})

module.exports = router;

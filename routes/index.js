var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  resource = req.query.resource
  res.render('index', { title: 'Express' });
});

router.get('/map', function(req, res, next){
  word = req.query.word
  console.log("WORD in index " +word)
  res.render('map', {word: word})
})
router.post('/submit', function(req, res, next){
  var word = req.body.word;
  res.redirect('/api/' + word);
})

module.exports = router;

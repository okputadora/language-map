const express = require('express');
const router = express.Router();
var etymologyController = require('../controllers/EtymologyController')

router.post("/", function(req, res, next){
  var word = req.body.word
  // grab the text from the web
  // console.log(word)
  etymologyController.post(word)
  .then(function(etymology){
    res.json({
      confirmation: "success",
      etymology: etymology
    })
  })
  .catch(function(err){
    res.json({
      confirmation: 'entry failed',
      message: err
    })
  })
})

module.exports = router;

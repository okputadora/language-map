const express = require('express');
var EtymologyController = require('../Controllers/EtymologyController')
const router = express.Router();

router.post("/", function(req, res, next){
  var word = req.body.word
  // grab the text from the web
  // console.log(word)
  EtymologyController.post(word)
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

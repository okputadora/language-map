var express = require('express')
var EtymologyController = require('../Controllers/EtymologyController')
var router = express.Router()

router.get('/', function(req, res, next){
  var word = req.query.word
  console.log("WORD "+ word)
	if (!word){
		res.json({
			confirmation:'fail',
			message:'Invalid resource...check your spelling'
		})
    return
	}

	EtymologyController.get(word)
	.then(function(results){
    console.log(results.origins)
		res.json({
	    confirmation: 'success',
	    result: results
	  })
	})
	.catch(function(err){
		res.json({
			confirmation: 'fail',
			message: err
		})
	})
})

module.exports = router

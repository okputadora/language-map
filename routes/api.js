var express = require('express')
var etymologyController = require('../controllers/EtymologyController')
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
	// the false parameter here indicated that we dont want the raw response
	//  we want the password to be hidden. req.query gets paramaters for a GET Request
	// req.body is for POST request
	etymologyController.get(word)
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

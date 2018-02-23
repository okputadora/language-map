const express = require('express');
const router = express.Router();
var Scraper = require('../controllers/scrape')

// important that languages contained in the names of other languages come after
// i.e. english comes after old and middle english
const languages = ['pie', 'middle english', 'old english', 'modern english',
  'english', 'modern french','old french', 'middle french', 'anglo-french', 'french',
  'old low frankish', 'spanish', 'italian', 'old norse', 'scandanavian', 'swedish','old saxon',
  'old frisian', 'west frisian', 'middle dutch', 'dutch', 'proto-germanic', 'protogermanic',
  'west germanic', 'old high german', 'germanic', 'german','sanskrit', 'welsh','gothic',
  'latin', 'vulgar latin', 'greek', 'arabic', 'hebrew', 'etruscan', 'czech', 'slavic', 'russian', 'gallo-roman',
  'old church slavonic', 'pie root', 'chinese', 'japanese', 'hittite', 'lithuanian', 'malay',
  'bantu', 'swahili', 'portuguese', 'gaulish', 'old irish','afrikaans', 'semetic', 'phoenician', 'phoenician root'
  ]
function findOrigins(text){
  var origins = []
  // I don't like this nested for loop thing here but forEach wasn't cutting it
  // for the first one because I want to increment by 2 and I need to be able to
  // break out of the second one
  for (var i = 0; i < text.length; i += 2){
    for (var x = 0; x < languages.length; x++){
      // if this bit of text contains a language keyword and 'from' or its the first text bit (and
      // therefore we know its 'from')
      if (text[i].toLowerCase().indexOf(languages[x]) >= 0 && (text[i].toLowerCase().indexOf("from") > 0 || i == 0)){
        // add the data to origins
        origins.push({"language": languages[x], "word": text[i+1]})
        break;
      }
    }
  }
  return origins;
}

// much room for improvement here to break things down
// into smaller reusable functions
function findCousins(text){
  var cousins = []
  for (var i = 0; i < text.length; i += 2){
    // keep adding until we find the end of the source also
    if (lookingForClosing){
      // if we've found the closing
      if (text[i].toLowerCase().indexOf(')') >= 0){
        break;
      }
      var langs = []
      languages.forEach(function(elem){
        if (text[i].toLowerCase().indexOf(elem) >= 0){
          langs.push(elem);
        }
      })
      console.log("additional langs: "+langs)
      langs.forEach(function(elem){
        cousins.push({"root": root, "language": elem, "word": word})
      })

    }
    if (text[i].toLowerCase().indexOf('source also of') >= 0){
      var root = text[i-1]
      var langs = []
      languages.forEach(function(elem){
        if (text[i].toLowerCase().indexOf(elem) >= 0){
          langs.push(elem)
        }
      })
      console.log(langs)
      var word = text[i+1]
      var lookingForClosing = true;
      langs.forEach(function(elem){
        cousins.push({"root": root, "language": elem, "word": word})
      })
    }
  }
  return cousins
}
function parseEtymology(text, callback){
  // returns array of origin objects
  var origins = findOrigins(text)
  var cousins = findCousins(text)
  callback([origins, cousins])
}
router.get("/:word", function(req, res, next){
  var word = req.params.word
  Scraper.get(word)
  .then(function(result){
    parseEtymology(result[0].text, function(parsedEtymology){
      res.json({
        confirmation: 'success',
        origins: parsedEtymology[0],
        cousins: parsedEtymology[1]
      })
    })
  })
  .catch(function(err){
    res.json({
      confirmation: 'fail',
      message: err
    })
  })
})

module.exports = router;

const express = require('express');
const router = express.Router();
var Scraper = require('../controllers/scrape')

// important that languages contained in the names of other languages come after
// i.e.french comes after old french
const languages = ['pie', 'middle english', 'old english', 'modern english', 'modern french','old french', 'middle french', 'anglo-french', 'french',
  'old low frankish', 'spanish', 'italian', 'old norse', 'scandanavian', 'swedish','old saxon',
  'old frisian', 'west frisian', 'middle dutch', 'dutch', 'proto-germanic', 'protogermanic',
  'west germanic', 'old high german', 'germanic', 'german','sanskrit', 'welsh','gothic',
  'latin', 'vulgar latin', 'greek', 'arabic', 'hebrew', 'etruscan', 'czech', 'slavic', 'russian', 'gallo-roman',
  'old church slavonic', 'pie root', 'chinese', 'japanese', 'hittite', 'lithuanian', 'malay',
  'bantu', 'swahili', 'portuguese', 'gaulish', 'old irish','afrikaans', 'semetic', 'phoenician', 'phoenician root',
  'avestan'
  ]
function findOrigins(text){

  var origins = []
  var originsIndex
  // I don't like this nested for loop thing here but forEach wasn't cutting it
  // for the first one because I want to increment by 2 and I need to be able to
  // break out of the second one
  for (var i = 0; i < text.length; i += 2){

    // parse the definition if there is one
    if (text[i].indexOf('"') >= 0 && origins.length > 0){
      definition = text[i].match( /"(.*?)"/ )[1];
      origins[originsIndex].definition = definition

    }
    for (var x = 0; x < languages.length; x++){
      // if this bit of text contains a language keyword and 'from' or its the first text bit (and
      // therefore we know its 'from')
      if (text[i].toLowerCase().indexOf(languages[x]) >= 0 && (text[i].toLowerCase().indexOf("from") > 0 || i == 0)){
        // add the data to origins
        if (text[i+1]){
          origins.push({"language": languages[x], "word": text[i+1]})
          // save this index so if we find a definition later we know where to
          // put it
          originsIndex = origins.length - 1
          break;
        }

      }
    }
  }
  console.log(origins)
  return origins;
}

// much room for improvement here to break things down
// into smaller reusable functions
function findCousins(text){
  var cousins = []
  var cousinsIndex = 0;
  for (var i = 0; i < text.length; i += 2){
    if (text[i].indexOf('"') >= 0 && cousins.length > 0){
      definition = text[i].match( /"(.*?)"/ )[1];
      console.log(definition)
      console.log(cousins)
      console.log(cousinsIndex)
      cousins[cousinsIndex].definition = definition

    }
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
      var word = text[i+1]
      langs.forEach(function(elem){
        cousins.push({"root": root, "language": elem, "word": word})
        cousinsIndex = cousins.length - 1
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
  if (origins.length == 0) {
    origins = text.join()
  }
  console.log(origins.length)
  callback([origins, cousins])
}
router.get("/:word", function(req, res, next){
  var word = req.params.word
  Scraper.get(word)
  .then(function(result){
    // console.log(result)
    parseEtymology(result[0].text, function(parsedEtymology){
      res.json({
        confirmation: 'success',
        origins: parsedEtymology[0],
        cousins: parsedEtymology[1],
        relatedEntries: result.relatedEntries
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

const Etymology = require('../Models/Etymology')
const Scrape = require('../utils/scrape.js')
const Promise = require('bluebird')
// important that languages contained in the names of other languages come after
// // i.e.french comes after old french -- this is because...
const languages = ['pie', 'middle english', 'old english', 'modern english', 'modern french','old french', 'middle french', 'anglo-french', 'french',
  'old low frankish', 'spanish', 'italian', 'old norse', 'scandanavian', 'swedish','old saxon',
  'old frisian', 'west frisian', 'middle dutch', 'dutch', 'proto-germanic', 'protogermanic',
  'west germanic', 'old high german', 'germanic', 'german','sanskrit', 'welsh','gothic',
  'latin', 'vulgar latin', 'greek', 'arabic', 'hebrew', 'etruscan', 'czech', 'slavic', 'russian', 'gallo-roman',
  'old church slavonic', 'pie root', 'chinese', 'japanese', 'hittite', 'lithuanian', 'malay',
  'bantu', 'swahili', 'portuguese', 'gaulish', 'old irish','afrikaans', 'semetic', 'phoenician', 'phoenician root',
  'avestan'
  ]

module.exports = {
  get: function(word){
    return new Promise(function(resolve, reject){
      Etymology.find({word: word}, function(err, result){
        if(err){
          reject(err)
          return
        }
        resolve(result[0].treeify())
      })
    })
  },
  post: function(word){
    return new Promise(function(resolve, reject){
      Scrape.get(word)
      .then(function(result){
        console.log(result.relatedEntries)
        // parse the result into the datastructure we want
        var parsedResult = parseEtymology(result[0]);
        etymology = {
          word: word,
          pos: result[0].pos,
          origins: parsedResult.origins,
          cousins: parsedResult.cousins,
          relatedEntries: result.relatedEntries
        }
        console.log("parsed result "+ parsedResult)
        Etymology.create(etymology, function(err, etymologyFromDb){
          if(err){
            reject(err)
            return
          }
          resolve(etymologyFromDb)
        })
      })
      .catch(function(err){
        reject(err)
      })
    })
  }
}

function parseEtymology(unparsed){
  text = unparsed.text
  word = unparsed.word
  // returns array of origin objects
  var origins = findOrigins(text)
  origins.unshift({language: 'english', word: word, definition:'coming soon'})
  console.log(origins)
  var cousins = findCousins(text)
  // if we couldn't produce a tree structure from the text
  if (origins.length == 0) {
    origins = text.join()
  }
  return {origins: origins, cousins: cousins}
}
function findOrigins(text){

  var origins = []
  var originsIndex
  // I don't like this nested for loop thing here but forEach wasn't cutting it
  // for the first one because I want to increment by 2 and I need to be able to
  // break out of the second one
  for (var i = 0; i < text.length; i += 2){

    // parse the definition if there is one, but don't look for quotes in the first text bit
    if (text[i].indexOf('"') >= 0 && origins.length > 0){
      definition = text[i].match( /"(.*?)"/ )[1];
      origins[originsIndex].definition = definition

    }
    // go through all of the languages and see if they're in the text
    for (var x = 0; x < languages.length; x++){
      // if this bit of text contains a language keyword and 'from' or its the first text bit (and
      // therefore we know its 'from')
      if (text[i].toLowerCase().indexOf(languages[x]) >= 0 && (text[i].toLowerCase().indexOf("from") > 0 || i == 0)){
        // and if there's another text bit after this one
        if (text[i+1]){
          // then we know the next text bit is the word so add it and the language to origins
          origins.push({"language": languages[x], "word": text[i+1], "children":[]})
          // save this index so if we find a definition later we know where to
          // put it
          originsIndex = origins.length - 1
          // we found the language, so rather than look through the rest of them
          // we break from the for loop
          break;
        }

      }
    }
  }
  return origins;
}
// much room for improvement here to break things down
// into smaller reusable functions -- also we're only returning the first root
function findCousins(text){
  var cousins = []
  var cousinsIndex = 0;
  for (var i = 0; i < text.length; i += 2){
    if (text[i].indexOf('"') >= 0 && cousins.length > 0){
      definition = text[i].match( /"(.*?)"/ )[1];
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

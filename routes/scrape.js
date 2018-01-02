var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');


var sources = ['PIE', 'middle english', 'old english', 'modern english',
'english', 'modern french','old french', 'middle french', 'anglo-french', 'french',
'old low frankish', 'spanish', 'italian', 'old norse', 'scandanavian', 'swedish','old saxon',
'old frisian', 'west frisian', 'middle dutch', 'dutch', 'proto-germanic', 'protogermanic',
'west germanic', 'old high german', 'germanic', 'german','sanskrit', 'welsh','gothic',
'latin', 'vulgar latin', 'greek', 'etruscan', 'czech', 'slavic', 'russian', 'gallo-roman',
'old church slavonic', 'root', 'chinese', 'japanese', 'hittite', 'lithuanian', 'malay',
'bantu', 'swahili', 'portuguese', 'afrikaans',
];


router.get("/:word", function(req, res, next) {
  var word = req.params.word;
  var etymology = {
    "word": word,
    "date": "",
    "original-meaning": "",
    "origins":{
    }
  };
  var source = '';
  var definition = '';
  function stripPunc(text){
    strippedText = text.replace(/[.\/#!$%\^&\*;:{}=\-_`~()]/g,"")
               .replace(/\s{2,}/g," ")
               .trim();
    return strippedText;
  }
  function findSources(text){
    text = text.toUpperCase();
    for (i in sources){
      fromText = text.search(sources[i].toUpperCase());
      if (fromText > -1){
        console.log(text);
        return sources[i].toUpperCase();
      }
    }
  }
  function findCousins(text){}
  function getDate(text){
    console.log("get date and OGM");
    // Get date
    dateIndicators = ["c", "1", "2", "3", "4",
                      "5", "6", "7", "8", "9"];
    eraIndicators = ["mid", "late", "early"];
    // if first sentence starts with a date
    dateIndicators.forEach(function(i){
      if (text.substring(0, 5).includes(i)){
        date = text.substring(0, text.indexOf(" "));
        console.log("DATE: " + date);
        if (/"/.test(text)){
          originalMeaning = text.match(/"(.*?)"/)[1];
          etymology["original-meaning"] = originalMeaning;
        }
        etymology["date"] = date;
        return;
      }
    })
    // if first sentence starts with an era
    eraIndicators.forEach(function(i){
      if (text.substring(0, text.indexOf(" ")).includes(i)){
        date = text.substring(0, text.indexOf(","));
        console.log("DATE: " + date);
        if (/"/.test(text)){
          originalMeaning = text.match(/"(.*?)"/)[1];
          etymology["original-meaning"] = originalMeaning;
        }
        etymology["date"] = date;
        return;
      }
    })
    // if first sentence starts with a definition
    originalMeaning = text.substring(0, text.indexOf("."))
    etymology["original-meaning"] = originalMeaning;
  }

  etymology["word"] = word;
  var url = 'https://www.etymonline.com/word/' + word;
  superagent
    .get(url)
    // .query(query);
    .end(function(err, response){
      if (err){
        res.json({
          confirmation: 'fail',
          message: err
        })
        return;
      }
      // scrape 'section' tags
      $ = cheerio.load(response.text);
      $('section').each(function(i, element){
        var className = element.attribs.class;
        if (className == 'word__defination--2q7ZH'){
          // console.log("class found");
          // <object></object>
          var definitionObj = element.children[0];
          //  for each of the <p></p> tags...
          definitionObj.children.forEach(function(element, i){
            // ... find the one with text
            if (element.children.length > 0){
              // <p></p> containing text
              // initialize  json etymologyd

              // track iterations so we can know when to initialize a new word etymology
              var counter = 0;
              element.children.forEach(function(content, q){
                // if its the first line look for a date
                if (q == 0){
                  firstLine = content.data;
                  getDate(firstLine);
                }
                // if text
                else if (content.data != undefined){
                  // console.log(content.data);
                  source = content.data;
                  // find definition
                  if (element.children[i+1].attribs.class != 'foreign'){
                    definition = element.children[i+1].data;
                    if (/"/.test(definition)){
                      definition = definition.match(/"(.*?)"/)[1];
                    }
                    else if (definition.indexOf(",")){
                      definition = definition.substring(0, definition.indexOf(","));
                    }
                  }
                }
                // if span class
                else{
                  var span = content.children;
                  // console.log(span[0].data);
                  originWord = span[0].data;
                }
                if (counter == 1){
                  strippedSource = stripPunc(source);
                  source = findSources(strippedSource);
                  originWord = stripPunc(originWord);
                  definition = stripPunc(definition);
                  if (source != undefined){
                    etymology["origins"][source] = {"word": originWord, "definition": definition};
                  }
                  counter = 0;
                }
                else{ counter = 1;}
              })
            }
          })
        }
      })
      // return object of word origins
      // res.redirect('../map/' + word +'/' + JSON.stringify(etymology));
      res.json(etymology);
    })
  })

module.exports = router;

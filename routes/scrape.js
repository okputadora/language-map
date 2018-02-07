var express = require('express');
var router = express.Router();super
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
  var etymology = {};
  var entry = {};
  var source = '';
  var definition = '';
  function getPOS(text){
    index = text.indexOf(" ");
    pos = text.substring(index + 1);
    return pos;
  }
  function parseText(element){
    var origins = {};
    originWord = undefined;
    element.children.forEach(function(content, q){
      console.log(content.data);
      if(content.data){
       // parse def
         definition = getDefinition(content.data)
         // if this is the first runthrough
         if (q==0){
           // the definition will be for the word that we searched for
           entry.definition = definition;
         }
         // else the definition will be for the previous source
         else{
           origins[source] = {"word": originWord, "definition": definition};
         }
         // we look for the source in the current text after assigning the definition
         // to the previous source
         source = findSources(content.data);
         //parse root word
         //parse date
         // console.log("DATE: " + getDate(content.data))
         //parse definition
         // console.log('DEFINITION: ' +getDefinition(content.data))
         console.log(definition);
      }
      // if we have a source to match the <span class=foreign>
      else if(source){
        originWord = content.children[0].data;
      }
    })
    entry["origins"] = origins;
  }
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
        return sources[i].toUpperCase();
      }
    }
  }
  function getDefinition(text){
    if (/"/.test(text)){
      def = text.match(/"(.*?)"/g);
      return def;
    }
  }
  function findCousins(text){}
  function getDate(text){
    // Get date
    dateIndicators = ["1", "2", "3", "4",
                      "5", "6", "7", "8", "9"];
    eraIndicators = ["mid", "late", "early"];
    // if first sentence starts with a date
    dateIndicators.forEach(function(i){
      if (text.includes("c. " + i)){
        date = text.substring(text.indexOf("c"), text.indexOf(" "));
        if (/"/.test(text)){
          originalMeaning = text.match(/"(.*?)"/);
          etymology["original-meaning"] = originalMeaning;
        }
        etymology["date"] = date;
        return date;
      }
    })
    // if first sentence starts with an era
    eraIndicators.forEach(function(i){
      if (text.substring(0, text.indexOf(" ")).includes(i)){
        date = text.substring(0, text.indexOf(","));
        if (/"/.test(text)){
          originalMeaning = text.match(/"(.*?)"/)[1];
          etymology["original-meaning"] = originalMeaning;
        }
        etymology["date"] = date;
        return date;
      }
    })
  }

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
      $('div').each(function(i, element){
        var className = element.attribs.class;
        if (className == 'word--C9UPa'){
          // console.log("class found");
          var title = element.children[0].children[0].children[0].data;
          pos = getPOS(title);

            entry = {
            "word": word,
            "pos": pos,
          }
          // because most elements dont have class names we need to find the text
          // by searching the children...
          var text = element.children[0].children[1].children[0];
          text.children.forEach(function(element, e){
            // if this paragraph has text
            if (element.children.length > 0){
              // element = text
              parseText(element);
            }
          })
          entryName = 'entry' + i;
          etymology[title] = entry;
        }
      })
      res.json(etymology);
    })
  })


module.exports = router;

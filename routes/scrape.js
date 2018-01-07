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
      if(content.data){
       // console.log("CONTENT:" +content.data);
       // parse function
         // parse word
         //parse root language
         definition = getDefinition(content.data)
         if (q==0){
           entry.definition = definition;
         }
         else{
           origins[source] = {"word": originWord, "definition": definition};
         }
         source = findSources(content.data);
         //parse root word
         //parse date
         // console.log("DATE: " + getDate(content.data))
         //parse definition
         // console.log('DEFINITION: ' +getDefinition(content.data))

         console.log(definition);

      }
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
      if (text.includes(i)){
        date = text.substring(0, text.indexOf(" "));
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
    // if first sentence starts with a definition
    originalMeaning = text.substring(0, text.indexOf("."))
    etymology["original-meaning"] = originalMeaning;
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
          // console.log(entry);
          var text = element.children[0].children[1].children[0];
          text.children.forEach(function(element, e){
            if (element.children.length > 0){
              // element = text
              parseText(element);
            }
          })
          console.log(entry);
          entryName = 'entry' + i;
          etymology[title] = entry;
          console.log(etymology);
        }
      })
      res.json(etymology);
    })
  })


  //
  //         // <object></object>
  //         var definitionObj = element.children[0];
  //         //  for each of the <p></p> tags...
  //         definitionObj.children.forEach(function(element, x){
  //           // ... find the one with text
  //           if (element.children.length > 0){
  //             // <p></p> containing text
  //
  //             // track iterations so we can know when to initialize a new word etymology
  //             var counter = 0;
  //             element.children.forEach(function(content, q){
  //               if(content.data){
  //                 console.log("CONTENT:" +content.data);
  //                 // parse function
  //                   // parse word
  //
  //                   //parse root language
  //                   console.log("SOURCE: "  + findSources(content.data));
  //                   //parse root word
  //                   //parse date
  //                   console.log("DATE: " + getDate(content.data))
  //                   //parse definition
  //                   console.log('DEFINITION: ' +getDefinition(content.data))
  //                   definition = getDefinition(content.data)
  //                   if (q==0){
  //                     entry = {
  //                       "word": word,
  //                       "POS": "",
  //                       "date": "",
  //                       "originalMeaning": definition,
  //                       "origins":{}
  //                   }
  //                     console.log("WORD: " + word);
  //                     etymology.word = word;
  //                     etymology.originalMeaning = definition;
  //                   }
  //               }
  //               else{console.log('WORD: ' +content.children[0].data)}
  //             })
  //           }
  //         })
  //       }
  //       etymology[i] = entry;
  //     })
  //
  //     // return object of word origins
  //     // res.redirect('../map/' + word +'/' + JSON.stringify(etymology));
  //     res.json(etymology);
  //   })
  // })

module.exports = router;

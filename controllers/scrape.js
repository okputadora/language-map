const superagent = require('superagent')
const cheerio = require('cheerio');
var Promise = require('bluebird');
const words = require('an-array-of-english-words')
const stringSimilarity = require('string-similarity')
var  funWords = words.filter(w => !!w.match(/^abacus/i))
// var funWords = ["honey", "bone", "gfhlkjsdfg", "break"]
module.exports = {
  get: function(word){
    var etymology = [];
    return new Promise(function(resolve, reject){
      // initialize an empty entry and make the request
      var entry = {}
      var url = 'https://www.etymonline.com/word/' + word;
      superagent
      .get(url)
      .end(function(err, response){
        if (err){
          reject(err)
          return
        }
        // scrape 'section' tags
        $ = cheerio.load(response.text);
        $('div').each(function(i, element){
          var className = element.attribs.class;
          if (className == 'word--C9UPa'){
            // console.log("class found");
            var title = element.children[0].children[0].children[0].data;
            var entry = {}
            entry["word"] = word
            entry["pos"] = getPOS(title)
            console.log(entry["pos"])
            // because most elements dont have class names we need to find the text
            // by searching the children...
            var text = element.children[0].children[1].children[0];
            var textArray = []
            text.children.forEach(function(element, e){
              // if this paragraph has text
              if (element.children.length > 0){
                // element = text
                element.children.forEach(function(sentence, e){
                  if (sentence.data){
                    textArray.push(sentence.data)
                  }
                  // or if its a <span class="foreign"
                  else if (sentence.children[0]){ textArray.push(sentence.children[0].data)}
                })
                // right now this just grabs the first paragraph
                // moving it out of the for each methods will allow it to gather
                // the other paragraphs...but i think this might be good for our purposes

              }
            })
            if (textArray[0] != undefined){
              entry["text"] = textArray
              etymology.push(entry)
              return
            }
          }
        })
        var relatedWords = []
        $("ul").each(function(i, element){
          if (element.attribs.class == "related__container--22iKI"){
            element.children.forEach(function(elem){
              elem.children.forEach(function(el){
                // if it is dissimlar enough
                var relatedWord = el.children[0].data
                var similarity = stringSimilarity.compareTwoStrings(relatedWord, word)
                if (similarity < .6){
                  console.log("similarity between "+word+" and "+relatedWord+ " = "+similarity)
                  relatedWords.push(relatedWord)
                }
              })
            })
          }
        })
        etymology["relatedEntries"] = relatedWords
        resolve(etymology)
      })
    })
    function getPOS(text){
      index = text.indexOf(" ");
      pos = text.substring(index + 1);
      return pos;
    }
  }
}


const superagent = import('superagent')
const cheerio = require('cheerio');
const words = require('an-array-of-english-words')
const funWords = words.filter(w => !!w.match(/^abacus/i))
var etymology = {};
var source = '';
var definition = '';

var sources = ['PIE', 'middle english', 'old english', 'modern english',
'english', 'modern french','old french', 'middle french', 'anglo-french', 'french',
'old low frankish', 'spanish', 'italian', 'old norse', 'scandanavian', 'swedish','old saxon',
'old frisian', 'west frisian', 'middle dutch', 'dutch', 'proto-germanic', 'protogermanic',
'west germanic', 'old high german', 'germanic', 'german','sanskrit', 'welsh','gothic',
'latin', 'vulgar latin', 'greek', 'arabic', 'hebrew', 'etruscan', 'czech', 'slavic', 'russian', 'gallo-roman',
'old church slavonic', 'PIE root', 'chinese', 'japanese', 'hittite', 'lithuanian', 'malay',
'bantu', 'swahili', 'portuguese', 'afrikaans', 'semetic', 'phoenician', 'phoenician root'
];

google.charts.load('current', {packages:["orgchart"]});
getEtymology(['honey'], parseText, function(){
  google.charts.setOnLoadCallback(drawChart);
})

function getPOS(text){
  index = text.indexOf(" ");
  pos = text.substring(index + 1);
  return pos;
}
function stripPunc(text){
  strippedText = text.replace(/[.\/#!$%\^&\*;:{}=\-_`~()]/g,"")
             .replace(/\s{2,}/g," ")
             .trim();
  return strippedText;
}
function findSources(text, callback){
  text = text.toUpperCase();
  for (i in sources){
    fromText = text.search(sources[i].toUpperCase());
    if (fromText > -1){
      callback(sources[i].toUpperCase());
    }
  }

}
function getDefinition(text, callback){
  if (/"/.test(text)){
    // looking for sentence in quotes
    def = text.match(/"(.*?)"/g);
    callback(def);
  }
}
function getDate(text, callback){
  // Get date
  dateIndicators = ["1", "2", "3", "4",
                    "5", "6", "7", "8", "9"];
  eraIndicators = ["mid", "late", "early"];
  // if first sentence starts with a date
  dateIndicators.forEach(function(i){
    if (text.includes("c. " + i)){
      console.log('text includes c.')
      date = text.substring(text.indexOf("c"), text.indexOf(","));
      console.log("DATE: " + date)
      if (/"/.test(text)){
        OGmeaning = text.match(/"(.*?)"/);
        callback([date, OGmeaning]);
      }
      else{
        callback([date]);
      }
      return
    }
  })
  // if first sentence starts with an era
  eraIndicators.forEach(function(i){
    if (text.substring(0, text.indexOf(" ")).includes(i)){
      date = text.substring(0, text.indexOf(","));
      if (/"/.test(text)){
        OGmeaning = text.match(/"(.*?)"/)[1];
        callback([date, OGmeaning]);
      }
      else{
        callback([date, OGmeaning]);
      }
      return
    }
  })
}
function getEtymology(words, callback){
  var entry = {};
  if (words.length <= 0){
    callback(entry);
    return;
  }
  word = words[0];
  // after we grab the word remove it so this list will eventually be length
  // = 0 and the recursion will end
  words.shift();
  var url = 'https://www.etymonline.com/word/' + word;
  superagent
    .get(url)
    // consider doing the scraping outside of this function, after we return
    // the complete text
    .end(function(err, response){
      if (err){
        getEtymology(words, callback)
        return
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
          var textArray = []
          text.children.forEach(function(element, e){
            // if this paragraph has text
            if (element.children.length > 0){
              // element = text
              element.children.forEach(function(sentence, e){
                if (sentence.data){
                  textArray.push(sentence.data)
                }
                else if (sentence.children[0]){ textArray.push(sentence.children[0].data)}
              })
            }
            entry["text"] = textArray
          })
          etymology[title] = entry;

        }
      })
      getEtymology(words, callback)
    })
    return;
}

function parseText(){
  for (var word in etymology){
    text = etymology[word].text
    origins = []
    text.forEach(function(element, e){
      if (e == 0){
        getDate(element, function(date){
          etymology[word]["date"] = date[0];
          etymology[word]["original meaning"] = date[1];
        });
      }
      // look origin language key words
      findSources(element, function(source){
        if (source.toUpperCase() != 'ENGLISH'){
          origin = {
            source: source,
            word: text[e+1]
          }
          origins.push(origin)
        }
        if (e > 0){
          getDefinition(element, function(definition){
            origin.definition = definition;
          })
        }
      })
    })
    etymology[word].origins = origins

  }
}
function drawChart() {
 var data = new google.visualization.DataTable();
 data.addColumn('string', 'Name');
 data.addColumn('string', 'Manager');
 data.addColumn('string', 'ToolTip');

 // For each orgchart box, provide the name, manager, and tooltip to show.
 data.addRows([
   [{v:'Mike', f:'Mike<div style="color:red; font-style:italic">President</div>'},
    '', 'The President'],
   [{v:'Jim', f:'Jim<div style="color:red; font-style:italic">Vice President</div>'},
    'Mike', 'VP'],
   ['Alice', 'Mike', ''],
   ['Bob', 'Jim', 'Bob Sponge'],
   ['Carol', 'Bob', '']
 ]);

 // Create the chart.
 var chart = new google.visualization.OrgChart(document.getElementById('wordmap'));
 // Draw the chart, setting the allowHtml option to true for the tooltips.
 chart.draw(data, {allowHtml:true});
}

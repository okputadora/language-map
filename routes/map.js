var express = require('express');
var router = express.Router();
var hogan = require('hogan.js');
var mapstructure = {
  "PIE":{
    "word": "",
    "date": "4500 BC",
    "children": {
      "Anatolian": {
        "word": "",
        "date": "3500 BC",
        "children": {
          "Luwian": {
            "Lycian": ""
          },
          "hittite": {},
          "carian": {},
        }
      },
      "Hellenic": {
        "word": "",
        "date": "3000 BC",
        "children":{
          "mycenaean": {
            "attic": {
              "classical Greek": {},
              "koline gree": {
                "greek": {}
              }
            },
            "ionic": {
              "epic greek": {}
            }
          }
        }
      },
      "Indo-Iranian": {
        "word": "",
        "date": "2100 BC",
        "children":{
          "Indo-Aryan": {
            "sanskrit": {}
          }
        }
      },
      "Italic": {
        "word": "",
        "date": "3100 BC",
        "children":{
          "latino faliscan": {
            "faliscan": {},
            "latin": {
              "classical latin": {},
              "vulgar latin": {
                "romance": {
                  "sardinian": {},
                }
              }
            }
          }
        }
      },
      "Celtic": {
        "word": "",
        "date": "1200 BC",
        "children":{

        }
      },
      "protogermanic": {
        "Germanic": {
          "Old-Norse": {
            "Old east norse": {
              "danish": {},
              "swedish": {},
            }
          },
          "Old High German": {
            "yiddish": {}
          },
          "Lower Franconian": {
            "old dutch": {},
            "middle dutch": {},
            "dutch": {},
            "flemish": {},
          },
          "Old Saxon": {},
          "Anglo-Frisian": {
            "Old-frisian": {
              "north frisian": {},
              "West frisian": {},
            },
            "old-english": {},
            "middle enlgish": {},
            "english": {},
            "scots": {},
            "yola": {}
          },
        },
      },
      "Balto-Slavic": {},
      "Albanian": {}
    }
  }
}
router.get("/:word/:origins", function(req, res, next) {
  var word = req.params.word;
  var origins = JSON.parse(req.params.origins);

  // compare found origins with all origins
  function checkFoundOrigins(searchWord, searchAgainst, callback){
    var foundOrigins = Object.keys(searchAgainst)
    for (var x in foundOrigins){
      if (searchWord.toUpperCase() == foundOrigins[x].toUpperCase()){
        console.log("search word: " + searchWord + " key " + foundOrigins[x]);
        console.log("match found");
        // add its value to map structure
        console.log(searchAgainst[foundOrigins[x]]);
        callback(searchAgainst[foundOrigins[x]]);
      }
    }
  }
  // build template object by comparing origins to mapstructure
  function recursiveObjectSearch(object){
    for (var i in object){
      console.log("key from map sturcutr: " + i);
      checkFoundOrigins(i, origins, function(value){
        // if mapstructur[i] is an object go one level deeper
        if (typeof object[i] == "object"){
          console.log("this is an object and should be further investigated");
          recursiveObjectSearch(object[i]);
        }
      });
    }
  }
  recursiveObjectSearch(mapstructure);
  mapstructure['PIE']['Anatolian']['Luwian']['word'] = "HELLO";
  res.json(origins);

})
module.exports = router;

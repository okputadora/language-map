const mongoose = require('mongoose');

var EtymologySchema = new mongoose.Schema({
  word: {type:String,default:''},
  pos: {type:String,default:''},
  origins: {type:Array,default:[]},
  cousins: {type:Array,default:[]},
  relatedEntries: {type:Array,default:[]}
})

EtymologySchema.methods.treeify = function(){
  console.log("treeifying")
  origins = this.origins
  var tree = treeify(origins)
  console.log(tree)
  var treeData ={
    word: this.word,
    pos: this.pos,
    origins: tree,
    cousins: this.cousins,
    relatedEntries: this.relatedEntries
  }
  return treeData
}
module.exports = mongoose.model('EtymologySchema', EtymologySchema)

// this  next function was more challenging than I thought.
// treeify copies every element and puts it into the
// next elements children property. After that loop is complete
// the last element of the array has the tree structure we want
//
// also this should be moved to the front end. we dont want to store the data
// like this because it seems like it will be harder to retrieve. We'll just preform
// treeify after we get the data from the database...or better yet! make this a method
// of Etymology Model called treeVersion
function treeify(array){
  // do some reformatting
  cutoffLength = -1
  array.forEach(function(element, i){
    // check to see if this language is pie or pie root. if so, we're
    // going to set the cutoff length here because anything that comes after this
    // is not relevant to the tree
    if (element.language == 'pie' || element.language == 'pie root'){
      cutoffLength = i + 1
    }
    // append children property to all but the last
    if (i < array.length - 1){
      element["children"] = []
    }
  })
  console.log(array)
  // if we found pie - proto-indo-european
  if (cutoffLength != -1){
    array.length=cutoffLength
  }
  console.log("hello")
  console.log(array.length)
  // add this element into the next one's children property
  array.forEach(function(elem, i){
    if (i < array.length - 1){
      array[i+1].children = [elem];
    }
  })
  console.log("|||||||||||||||||||||||||||||||||||||")
  // return the last element
  console.log(array)
  return array[array.length-1]
}

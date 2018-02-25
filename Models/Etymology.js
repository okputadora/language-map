const mongoose = require('mongoose');

var EtymologySchema = new mongoose.Schema({
  word: {type:String,default:''},
  pos: {type:String,default:''},
  origins: {type:Array,default:[]},
  cousins: {type:Array,default:[]},
  relatedEntries: {type:Array,default:[]}
})



module.exports = mongoose.model('EtymologySchema', EtymologySchema)

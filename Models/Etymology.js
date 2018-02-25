const mongoose = require('mongoose');

var EtymologySchema = new mongoose.Schema({
  word: {type:String,default:''},
  pos: {type:String,default:''},
  text: {type:Array,default:[]},
})

module.exports = mongoose.model('EtymologySchema', EtymologySchema)

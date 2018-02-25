const Etymology = require('../Models/Etymology')
const Scrape = require('../utils/scrape.js')
const Promise = require('bluebird')
module.exports = {
  get: function(word){
    return new Promise(function(resolve, reject){
      Etymology.find({word: word}, function(err, result){
        if(err){
          reject(err)
          return
        }
        resolve(result)
      })
    })
  },
  post: function(word){
    return new Promise(function(resolve, reject){
      Scrape.get(word)
      .then(function(result){
        // parse the result into the datastructure we want

        Etymology.create(result, function(err, etymology){
          if(err){
            reject(err)
            return
          }
          resolve(etymology)
        })
      })
      .catch(function(err){
        reject(err)
      })
    })
  }
}

const Etymology = require('../Models/Etymology')
const Scrape = require('../utils/scrape.js')
const Promise = require('bluebird')
module.exports = {
  post: function(word){
    return new Promise(function(resolve, reject){
      Scrape.get(word)
      .then(function(result){
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

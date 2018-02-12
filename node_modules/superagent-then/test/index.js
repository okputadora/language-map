var superagent = require('superagent');
var plugin = require('../');

// This will throw if the plugin doesn't work.
superagent
  .get('www.google.com')
  .use(plugin)
  .end()
  .then(function (response) {
    console.log('GET www.google.com:');
    console.log(response.status);
  }, function (err) {
    console.error('Error in GET www.google.com:');
    console.error(err);
  });

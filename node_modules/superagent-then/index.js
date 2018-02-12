var superagent = require('superagent');
var when = require('when');

function plugin(request) {
  var promise = when.promise(function (resolve, reject) {
    request.on('response', resolve);
    request.on('error', reject);
  });

  request.then = function then(onFulfilled, onRejected) {
    return promise.then(onFulfilled, onRejected);
  };
}

module.exports = plugin;

var config = require('../config');
var validate = require('hobbes-network-format/lib/validate/cmd');

module.exports = function(callback) {
  var args = config.get();
  validate(args.data, args, callback);
}
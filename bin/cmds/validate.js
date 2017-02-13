exports.command = 'validate'
exports.desc = 'Validate a CALVIN data is in HOBBES network format'
exports.builder = require('../shared')({
  dump : {
    describe : 'Dump errors to csv file',
    alias : 'd'
  }
});

exports.handler = require('../handler');
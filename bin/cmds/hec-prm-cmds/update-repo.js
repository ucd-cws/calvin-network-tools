exports.command = 'update-repo'
exports.desc = 'Apply flow results from dss file back to data repo'
exports.builder = require('../../hec-prm-shared')({
  regex: {
    describe : 'Regex to use when selecting dss path values to write back to repo.',
    alias : 'g'
  },
  cache: {
    describe : 'Cache data read from dss file in local json file',
    alias : 'l'
  },
  'clean-cache': {
    describe : 'Clears local update cache',
    alias : 'L',
    type : 'boolean'
  }
});

exports.handler = require('../../handler');
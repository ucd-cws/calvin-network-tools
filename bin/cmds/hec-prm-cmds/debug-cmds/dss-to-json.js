exports.command = 'dss-to-json'
exports.describe = 'Export DSS file to JSON'
exports.builder = require('../../../hec-prm-shared')({
  file: {
    describe : 'DSS file to export',
    alias : 'f'
  },
  regex: {
    describe : '[expression] Regex to use when selecting dss path values to write.',
    default : '*',
    alias : 'g'
  }
});

exports.handler = require('../../../handler');
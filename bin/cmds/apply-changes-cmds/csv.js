exports.command = 'csv'
exports.desc = 'Apply http://cwn.casil.ucdavis.edu Excel file download changes to repo'
exports.builder = require('../../hec-prm-shared')({
  file: {
    describe : 'CSV file',
    alias : 'f',
    demand: true
  },
  property : {
    describe : 'Property to apply changes to.  Ex: flow',
    alias : 'p',
    demand: true
  }
});
exports.handler = require('../../handler');
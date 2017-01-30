exports.command = 'show-build'
exports.describe = 'Print the JSON that will be passed to the DssWrite'
exports.builder = require('../../../hec-prm-shared')({
  start: {
    describe : '[YYYY-MM] Specify start date for TimeSeries data',
    alias : 's'
  },
  stop: {
    describe : '[YYYY-MM] Specify stop date for TimeSeries data',
    alias : 't'
  },
  debug: {
    describe : '[nodes] Set debug nodes.  Either "ALL", "*" or comma seperated list of prmnames (no spaces)',
    alias : 'd'
  },
  'show-data' : {
    describe : 'Print the csv file data as well',
    alias : 'S'
  }
});

exports.handler = require('../../../handler');
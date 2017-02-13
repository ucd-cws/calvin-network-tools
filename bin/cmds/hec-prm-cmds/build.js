exports.command = 'build'
exports.desc = 'Create pri and dss files'
exports.builder = require('../../hec-prm-shared')({
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
  'debug-cost' : {
    describe : 'set cost for debug nodes (default: 2000000)',
    default : 2000000,
    alias : 'D'
  },
  'debug-runtime' : {
    describe : 'Keeps the PRM NodeJS json file used to pass information to the dssWriter (Calvin HEC Runtime) jar',
    alias : 'R'
  },
  'no-descriptions' : {
    describe : 'If you exceed the max number of allowed descriptions in pri file, use this flag',
    alias : 'n'
  }
});

exports.handler = require('../../handler');
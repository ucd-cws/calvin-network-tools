exports.command = 'matrix [nodes...]'
exports.desc = 'Create a delimited matrix file to run 3rd party solver.'
exports.builder = require('../shared')({
  format: {
    describe : 'Output Format, dot | png (graphviz required)',
    choices : ['csv', 'tsv', 'dot', 'png'],
    default : 'csv',
    alias : 'f'
  },
  'no-header': {
    describe : 'Supress CSV/TSV Header',
    type : 'boolean',
    alias : 'N'
  },
  ts : {
    describe : '<sep> Time step separator',
    default : '@',
    alias : 'S'
  },
  fs : {
    describe : '<sep> Field Separator',
    default : ',',
    alias : 'F'
  },
  start : {
    describe : '[YYYY-MM] Specify start date for TimeSeries data',
    alias : 's'
  },
  stop : {
    describe : '[YYYY-MM] Specify stop date for TimeSeries data',
    alias : 't'
  },
  'max-ub' : {
    describe : 'Replace null upperbound with a big number.  Like 1000000',
    type: 'number',
    alias : 'M'
  },
  debug : {
    describe : 'Set debug nodes.  Either "ALL", "*" or comma seperated list of prmnames (no spaces)',
    alias : 'd'
  },
  to : {
    describe : '<filename> Send matrix to filename',
    default : 'STDOUT',
    alias : 'T'
  },
  'dump-nodes' : {
    describe : '<filename> Send list of nodes to filename, default=no output, can use STDOUT',
    alias : 'O'
  },
  'outbound-penalty' : {
    describe : '<json> Specify a penalty function for outbound boundary conditions. eg. [[10000,"-10%"],[0,0],[-10000,"10%"]]',
    alias : 'p'
  }
});

exports.handler = require('../handler');
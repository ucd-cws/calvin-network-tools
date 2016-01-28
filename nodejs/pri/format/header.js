'use strict';
var sprintf = require('sprintf-js').sprintf;
var months = require('./utils').months;

var zwts = [
  'STOR','FLOW(KAF)','FLOW_IN(KAF)','EVAP(KAF)',
  'FLOW_LOC(KAF)','FLOW_DIV(KAF)','DUAL_COST'
];
var mons

var zwfrq = ['STOR','FLOW(KAF)'];

module.exports = function(args) {
  var header = [];

  // TODO: calculating this when start & stop is not specified will be very time consuming for build time.
  var start = 'OCT1921';
  var stop = 'SEP2003';
  if( args && args.start && args.stop ) {
    start = new Date(args.start+'-15');
    stop = new Date(args.stop+'-15');

    start = months[start.getMonth()]+start.getFullYear();
    stop = months[stop.getMonth()]+stop.getFullYear();
  }


  header.push('.. Capitalization Model Run');
  header.push(sprintf('%-8.8s  %-70s','ZW','F='));
  header.push(sprintf('%-8.8s  %-10.10s%-10.10s','IDENT','SOURCE','SINK'));
  header.push(sprintf('%-8.8s  %-10.10s%-10.10s','TIME',start,stop));
  header.push('J11.0E-05 1.0E+06   1.0       1.0       1         3');

  // What to save
  header.push(sprintf('%-8.8s  %-80.80s','ZWTS','-ALL'));
  header.push(sprintf('%-8.8s  %-80.80s','ZWTS',zwts.join(' ')));

  // Not sure
  header.push(sprintf('%-8.8s  %-70.70s','ZWFRQ',zwfrq.join(' ')));
  return header.join('\n')+'\n';
};

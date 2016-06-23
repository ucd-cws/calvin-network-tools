'use strict';
var sprintf = require('sprintf-js').sprintf;
var header = require('./format/header');
var utils = require('./format/utils');

module.exports = function(pri, args, showHeader) {
  var outputtext = '';

  if( showHeader !== false ) {
    outputtext += header(args);
  }



  outputtext += '..\n..        ***** NODE DEFINITIONS *****\n..';
  outputtext += pri.nodelist.length > 0 ? '\n'+pri.nodelist.reverse().join('\n..\n') : '';
  outputtext += '\n..\n..        ***** INFLOW DEFINITIONS *****\n..';
  outputtext += pri.inflowlist.length > 0 ? '\n'+pri.inflowlist.reverse().join('\n..\n') : '';
  outputtext += '\n..\n..        ***** STORAGE LINK DEFINITIONS *****\n..';
  outputtext += pri.rstolist.length > 0 ? '\n'+pri.rstolist.reverse().join('\n..\n') : '';
  outputtext += '\n..\n..        ***** LINK DEFINITIONS *****\n..';
  outputtext += pri.linklist.length > 0 ? '\n'+pri.linklist.reverse().join('\n..\n') : '';

  return outputtext;
};

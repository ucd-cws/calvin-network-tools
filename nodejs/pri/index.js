'use strict';

var sprintf = require('sprintf-js').sprintf;

var header = require('./format/header');
var linkFormatter = require('./format/link');
var nodeFormatter = require('./format/node');

function format(node, config, options) {
  var props = node.properties;

  if( props.type !== 'Diversion' && props.type !== 'Return Flow' ) {
    config.pri.nodelist.push(nodeFormatter(props));
  }

  linkFormatter(config, node, options);
}


function init() {
  return {
    pd : {
      path : '',
      data : []
    },
    ts : {
      path : '',
      data : [],
    },
    pri : {
      header   : 'EMPTY',
      nodelist : [],
      linklist : [],
      rstolist : [],
      inflowlist : []
    }
  };
}

module.exports = {
  init : init,
  format: format,
  node_link : format,
  create: require('./create')
};

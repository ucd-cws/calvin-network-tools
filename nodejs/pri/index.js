'use strict';

var sprintf = require('sprintf-js').sprintf;

var header = require('./format/header');
var link = require('./format/link');
var node = require('./format/node');
var create = require('./create');

var args;


function format(n, config, options) {
  var np = n.properties;

  if( np.type !== 'Diversion' && np.type !== 'Return Flow' ) {
    config.pri.nodelist.push(node(np));
  }

  link(config, n, options);
}


function create(config, showHeader) {
  return create(config.pri, args, showHeader);
}

function init(argv) {
  args = argv;

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
  create: create
};

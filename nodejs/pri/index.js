'use strict';

var sprintf = require('sprintf-js').sprintf;

var header = require('./format/header');
var link = require('./format/link');
var node = require('./format/node');
var create = require('./create');

function format(node, config, options) {
  var props = node.properties;

  if( props.type !== 'Diversion' && props.type !== 'Return Flow' ) {
    config.pri.nodelist.push(node(props));
  }

  link(config, node, options);
}


function create(config, showHeader) {
  return create(config.pri, showHeader);
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
  create: create
};

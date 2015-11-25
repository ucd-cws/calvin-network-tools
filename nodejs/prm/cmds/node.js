'use strict';

var updateStorage = require('../lib/updateStorage');
var crawler = require('../../crawler');
var prepare = require('../lib/prepare');
var debug = require('../lib/debug');
var link = require('../../pri/format/link');
var path = require('path');

module.exports = function(argv) {
  if( argv._.length === 0 && !argv.debug ) {
    console.log('Please provide a node command [list | show]');
    process.exit(-1);
  }

  if( !argv.data ) {
    console.log('Please provide a data repo location');
    process.exit(-1);
  }

  if( argv.show ) {
    show(argv._, argv);
  } else if( argv.list ) {
    list(argv._, argv.data);
  }
};

function list(nodes, datapath) {
  for (var i = 0 ; i < nodes.length; i++) {
    nodes[i] = nodes[i].toUpperCase();
  }

  crawler(datapath, {parseCsv : false}, function(results){
    var i, node;

    for( i = 0; i < results.nodes.length; i++ ) {
      node = results.nodes[i];
      if( nodes[0] === '' || nodes[0] === 'ALL' || nodes.indexOf(node.properties.prmname.toUpperCase()) > -1 ) {
      }
    }

  });
}

function show(nodes, argv) {
  var o = {};
  if( argv['no-initialize'] ) {
    o.initialize = false;
  } else {
    o.initialize = argv.initialize !== undefined ? argv.initialize : 'init';
  }

  for (var i = 0 ; i < nodes.length; i++) {
    nodes[i] = nodes[i].toUpperCase();
  }

  var config = prepare.init();
  crawler(argv.data, {parseCsv : false}, function(results){
    var node, i;
    var list = [];

    if( argv.debug ) {
      list = debug(argv, results.nodes);
    } else {
      for( i = 0; i < results.nodes.length; i++ ) {
        node = results.nodes[i];
        if( nodes[0] === '' || nodes[0].toUpperCase() === 'ALL' || nodes.indexOf(node.properties.prmname.toUpperCase()) > -1 ) {
          list.push(node);
        }
      }
    }

    updateStorage(argv.start, argv.stop, list, function(){
      for( var i = 0; i < list.length; i++ ) {
        prepare.format(list[i], config, o);
      }

      console.log(prepare.pri(config, false));
    });
  });
}

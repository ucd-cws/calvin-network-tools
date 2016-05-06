// matrix prints out the required matrix inputs for any given set of nodes
// or links
// The matrix is i,j,k,c,a,l,u
// where i = origin
// j= terminal
// k = link number
// c = cost
// a =amplitude
// l = lower bound
// u = upper bound

'use strict';

var matrix = require('../matrix');
var config = require('../config').get();
var fs = require('fs');

module.exports = function (callback) {
  var cmd_opts;
  var matrix_output=[];
  var nodes_output=[];
  var node_list = {};

  function command_options(program, cmd) {
    var opts;
    var i;
    for (i = 0; i <= program.commands.length; i++) {
      opts = program.commands[i];
      if (opts._name === cmd) {
        return opts;
      }
    }
    return {};
  }
  // There has got to be a better way :)
  cmd_opts = command_options(config, 'matrix');

  // Defaults
  cmd_opts.fs = cmd_opts.fs || ',';
  if (cmd_opts.fs === ':tab:') {
    cmd_opts.fs = "\t";
  }
  config.ts = cmd_opts.ts || '@';
  cmd_opts.rs = cmd_opts.rs || "\n";
  cmd_opts.matrix = cmd_opts.matrix || "STDOUT";
  cmd_opts.nodes = cmd_opts.nodes || null;
  
  
  if (config.verbose) {
    console.log('Running matrix command.\n');
  }

  if (!config.nodes && !config.debug) {
    console.log('Please provide a nodes to ' + config.nodeCmdType);
    return callback();
  }

  if (!config.data) {
    console.log('Please provide a data repo location');
    return callback();
  }
  matrix(config, function (rows) {
    
    var header = ["i", "j", "k", "cost", "amplitude", "lower_bound", "upper_bound"];
    if (!cmd_opts.no-header) {
      matrix_output.push(header.join(cmd_opts.rs));
      node_output.push("node");
     }

    rows.forEach(function (r) {
      node_list[r[0]]=true;
      node_list[r[1]]=true;
      if (cmd_opts.max_ub) {
        if (r[6] === null) {
          r[6] = cmd_opts.max_ub;
        }
      }
      var line=r.join(cmd_opts.fs);
      matrix_output.push(line);
    });
    if (cmd_opts.nodes !== null) {
      nodes_output=Object.keys(node_list).sort();
      if (cmd_opts.nodes === "STDOUT") {
        console.log(nodes_output.join(cmd_opts.rs) + cmd_opts.rs);
      } else {
        fs.writeFile(cmd_opts.nodes, 
          nodes_output.join(cmd_opts.rs)+cmd_opts.rs,'utf8',
         (err) => { if (err) {throw err;}});
      }
    }

    if (cmd_opts.matrix !== null) {
        if (cmd_opts.matrix==="STDOUT") {
          console.log(matrix_output.join(cmd_opts.rs)+cmd_opts.rs);
        }  else {
          fs.writeFile(cmd_opts.matrix,
            matrix_output.join(cmd_opts.rs)+cmd_opts.rs,'utf8',
            (err) => {if (err) { throw err;}});
        }
    }
    callback();
  });
  // TODO: Should I catch errors here?
};

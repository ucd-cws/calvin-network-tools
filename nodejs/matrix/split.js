'use strict';

/*
 # split -

 Given a path, a set of options, and a set of ids returns three geometry sets of
 node/links; in,out, and edge.
 in - All links and nodes in the network
 out - All Links and Nodes outside the network
 edge - All Links and Nodes on the edge of the network.
 options:
 linked : [boolean] } : Default is true.
 expand : {inflows:1} : Standard expansion option

## OPTIONS

### Linked

If linked is true, here are the rules.
- Any link where both the origin and terminal nodes are *in* is *in*.
- Any link where one of origin / terminal are in is *edge*.
- Any link where neither origin / terminal are in is *out*.
- Any node with a link *in* and a link *out* is *edge*
- Any node with all links *in* is *in*


*/

var hnf = require('hobbes-network-format');

module.exports = function(path, opts, item_list, callback) {
    var linked = opts.linked || true;
    delete opts.linked ;
    var ins = [];
    var outs = [];
    var edges = [];

    var items = {};

    // This could also check for features and use id if that's what they are
    item_list.forEach(function(i) {
      items[i] = true;
    });


    hnf.crawl(path, opts, function(result) {
      var all = result.nodes.features;
      var one_in = {};
      var one_out = {};
      var maybe_in = {};

      all.forEach(function(n){
        var p = n.properties;
        if( p.origin && p.terminal ) { // Link
          if( items[p.id] ) {         // Explicitly *in*
            ins.push(n);
            one_in[n.origin] = true;
            one_in[n.terminal] = true;
          } else {
            if (items[n.origin]) {
              if (items[n.terminal]) {
                ins.push(n);
                one_in[n.origin] = true;
                one_in[n.terminal] = true;
              } else {
                edges.push(n);
              }
            } else {
              if (items[n.terminal]) {
                edges.push(n);
              } else {
                outs.push(n);
                one_in[n.origin] = true;
                one_in[n.terminal] = true;
              }
            }
          }
        } else {    // Node
          if (items[p.id]) {                    // Explicitly *in*
            ins.push(n);
          } else {
            maybe_in[p.id]=n;
          }
       }
     });

     // Now check for any nodes that are in by virtual of all links are *in*
     for( var maybe in one_in ) {
       if( !one_out[maybe] && maybe_in[maybe]) {
         ins.push(maybe_in[maybe]);
       }
     }

     // Okay return our sets
     callback({
       in : ins,
       edge : edges,
       out : outs
     });
  });
};

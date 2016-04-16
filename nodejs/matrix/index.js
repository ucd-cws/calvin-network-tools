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

var hnf=require('hnf');
var split=require('./split');

module.exports = function matrix() {
    
    var sets=split(config.path,ins);
      // Need to consider what updateStorge does with times
      for( var i = 0; i < list.length; i++ ) {
	  var net=list[i].properties;
	  if ((config.matrixB || true) && net.inflows) {
	      for (var key in net.inflows) {
		  var fn=net.inflows[key].inflow;
		  if (fn.match(/.*\.csv$/)) {
		      parse_csv(fn,function(err,data) {
			  data.forEach(function(d) {
			      console.log([[net.prmname,d[0]].join('@'),d[1]].join(','));
			  });
		      });
		  }
      }
	  }
      }
      callback();
  });
}

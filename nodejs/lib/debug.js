'use strict';

var dbgsrc = {
  properties : {
    type : 'debugnode',
    prmname : 'DBUGSRC',
    description : 'Dummy source node to test infeasibilities'
  }
};

var dbgsinks = {
  properties : {
    type : 'debugnode',
    prmname : 'DBUGSNK',
    description : 'Dummy source node to test infeasibilities'
  }
};

var sinkLink = {
  properties : {
    type : 'Diversion',
    prmname : 'DBUGSNK-SINK',
    origin : 'DBUGSNK',
    terminus : 'SINK',
    description : 'Debug link from DBUGSINK to SINK with high unit cost.',
    costs : {}
  }
};

var sourceLink = {
  properties : {
    type : 'Diversion',
    prmname : 'SOURCE-DBUGSRC',
    origin : 'SOURCE',
    terminus : 'DBUGSRC',
    description : 'Debug link from source to DBUGSOURCE with high unit cost.',
    costs : {}
  }
};

module.exports = function(nodes) {
  var config = require('../config').get();

  var cost = parseInt(config.debugCost) || 2000000;

  var all = false, matches = [];
  if( config.debug === '*' || config.debug.toLowerCase() === 'all' ) {
    all = true;
  } else {
    matches = config.debug.toLowerCase().split(',');
  }

  var newList = [], np;

  for( var i = 0; i < nodes.length; i++ ) {
    np = nodes[i].properties;
    if( np.type !== 'Diversion' &&
	     (all || matches.indexOf(np.prmname.toLowerCase()) > -1 )) {

      newList.push({
        properties : {
          type : 'Diversion',
          prmname : np.prmname+'DBUGSNK',
          origin : np.prmname,
          terminus : 'DBUGSNK',
          costs : {}
        }
      });

      newList.push({
        properties : {
          type : 'Diversion',
          prmname : 'DBUGSRC-'+np.prmname,
          origin : 'DBUGSRC',
          terminus : np.prmname,
          costs : {}
        }
      });

    }

    // Push this regardless
    newList.push(nodes[i]);
  }

  sinkLink.properties.costs.cost = cost;
  sourceLink.properties.costs.cost = cost;

  
  newList.push(sinkLink);
  newList.push(sourceLink);

  
  newList.push(dbgsinks);
  newList.push(dbgsrc);

  return newList;
};

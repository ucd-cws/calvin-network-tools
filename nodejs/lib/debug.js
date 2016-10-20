'use strict';

var dbgsrc = {
  properties : {
    type : 'debugnode',
    prmname : 'DBUGSRC',
    description : 'Dummy source node to test infeasibilities',
    hobbes : {
      debug: true,
      id : 'DBUGSRC',
      type : 'node'
    }
  }
};

var dbgsinks = {
  properties : {
    type : 'debugnode',
    prmname : 'DBUGSNK',
    description : 'Dummy source node to test infeasibilities',
    hobbes : {
      debug: true,
      id : 'DBUGSNK',
      type : 'node'
    }
  }
};

var sinkLink = {
  properties : {
    type : 'Diversion',
    prmname : 'DBUGSNK-SINK',
    description : 'Debug link from DBUGSINK to SINK with high unit cost.',
    hobbes : {
      debug: true,
      id : 'DBUGSNK-SINK',
      origin: 'DBUGSNK',
      terminus : 'SINK',
      type : 'link'
    },
    costs : {
      type : 'Constant'
    }
  }
};

var sourceLink = {
  properties : {
    type : 'Diversion',
    prmname : 'SOURCE-DBUGSRC',
    origin : 'SOURCE',
    terminus : 'DBUGSRC',
    description : 'Debug link from source to DBUGSOURCE with high unit cost.',
    hobbes : {
      debug: true,
      id : 'SOURCE-DBUGSRC',
      origin: 'SOURCE',
      terminus : 'DBUGSRC',
      type : 'link'
    },
    costs : {
      type : 'Constant'
    }
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
    np = nodes[i].properties.hobbes;
    if( np.type !== 'Diversion' &&
	     (all || matches.indexOf(np.id.toLowerCase()) > -1 )) {

      newList.push({
        properties : {
          type : 'Diversion',
          prmname : np.id+'-DBUGSNK',
          hobbes : {
            debug: true,
            id : np.id+'-DBUGSNK',
            type : 'link',
            origin : np.id,
            terminus : 'DBUGSNK', 
          },
          costs : {}
        }
      });

      newList.push({
        properties : {
          type : 'Diversion',
          prmname : 'DBUGSRC-'+np.id,
          hobbes : {
            debug: true,
            id : 'DBUGSRC-'+np.id,
            type : 'link',
            origin : 'DBUGSRC',
            terminus : np.id,
          },
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

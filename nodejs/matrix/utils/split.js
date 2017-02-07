/*
These are network utilities that should be added to the HNF
functions, but only when you return a split, so I don't know about that.
*/
function isInbound(network, id) {
  for( var i = 0; i < network.edge.in.length; i++ ) {
    if(id === network.edge.out[i].properties.hobbes.id) {
      return true;
    }
  }

  return false;
}

function isOutbound(network, id) {
  for( var i = 0; i < network.edge.out.length; i++ ) {
    if(id === network.edge.out[i].properties.hobbes.id) {
      return true;
    }
  }

  return false;
}

function inboundTo(network, id) {
  var inbound=[];
  network.edge.in.forEach(function(e){
    if (id === e.properties.hobbes.terminus) {
      inbound.push(e);
    }
  });
  return inbound;
}

function outboundFrom(network,id) {
  var outbound=[];
  network.edge.out.forEach(function(e){
    if(id === e.properties.hobbes.origin) {
      outbound.push(e);
    }
  });
  return outbound;
}
module.exports = {
  isInbound : isInbound,
  isOutbound : isOutbound,
  inboundTo : inboundTo,
  outboundFrom : outboundFrom
};

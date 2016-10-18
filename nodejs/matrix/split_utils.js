/*
These are network utilities that should be added to the HNF
functions, but only when you return a split, so I don't know about that.
*/
function is_inbound(network,id) {
  var is=false;
  network.edge.in.forEach(function(e) {
    if(id===e.properties.hobbes.id)
      is=true;
  });
  return is;
}

function is_outbound(network,id) {
  var is=false;
  network.edge.out.forEach(function(e) {
    if(id===e.properties.hobbes.id)
      is=true;
  });
  return is;
}

function inbound_to(network,id) {
  var inbound=[];
  network.edge.in.forEach(function(e){
    if(id===e.properties.terminus)
      inbound.push(e);
  });
  return inbound;
}

function outbound_from(network,id) {
  var outbound=[];
  network.edge.out.forEach(function(e){
    if(id===e.properties.origin)
      outbound.push(e);
  });
  return outbound;
}
module.exports={
  is_inbound:is_inbound,
  is_outbound:is_outbound,
  inbound_to:inbound_to,
  outbound_from:outbound_from
};

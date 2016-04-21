/*
These are network utilities that should be added to the HNF
functions, but only when you return a split, so I don't know about that.
*/
function is_inbound(network,id) {
  var is=false;
  network.edge.in.forEach(function(e) {
    if(id===e.properties.hobbes.networkId)
      is=true;
  });
  return is;
}

function is_outbound(network,id) {
  var is=false;
  network.edge.out.forEach(function(e) {
    if(id===e.properties.hobbes.networkId)
      is=true;
  });
  return is;
}

module.exports={
  is_inbound:is_inbound,
  is_outbound:is_outbound
};

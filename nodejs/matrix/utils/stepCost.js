
module.exports = function(costsK, physicalBounds, costs) {

  if( costs.length === 1 ) {
    return {
      clb : ((costsK.lb || 0) > (physicalBounds.LB || 0)) ? costsK.lb : physicalBounds.LB || 0,
      cub : (costsK.ub && (costsK.ub < physicalBounds.UB)) ? costsK.ub : physicalBounds.UB 
    }
  }

  var result = {
    clb : 0,
    cub : 0
  }

  if( costsK.lb > physicalBounds.LB ) {
    result.clb = costsK.lb;
  } else if ( (costsK.ub || 0) <= physicalBounds.LB ) {
    result.clb = costsK.ub || 0;
  } else {
    result.clb = physicalBounds.LB;
  }

  physicalBounds.LB -= result.clb;

  if( physicalBounds.UB === null ) {
    result.cub = costsK.ub;
  } else {
    if( costsK.ub !== null && costsK.ub <= physicalBounds.UB ) {
      result.cub = costsK.ub;
    } else {
      result.cub = physicalBounds.UB;
    }

    physicalBounds.UB -= result.cub;
  }

  return result;
}
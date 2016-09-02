'use strict';

var sprintf = require('sprintf-js').sprintf;
var config = require('../../config').get();

module.exports = function(np) {
//  var np=node.properties;
  var NODE;

  // Check for any storage values rather than type?
  // if (np.initialstorage || np.el_ar_cap || np.finalstorage)
  // if( np.type === 'Reservior' ) {

    // JM - HACK
    if( np.endingstorage > 10000000 ) {
      np.endingstorage = 0;
    }
    if( np.areacapfactor > 10000000 ) {
      np.areacapfactor = 0;
    }

    var hasInitialStorage = typeof np.initialstorage === 'number';
    var hasAreaCapFactor = typeof np.areacapfactor === 'number';
    var hasEndingStorage = typeof np.endingstorage === 'number';

    

    // JM - trying to match the Netbuilder output
    if( !hasInitialStorage && !hasAreaCapFactor && !hasEndingStorage ) {
      NODE = sprintf('%-8.8s  %-30.10s','NODE', np.prmname);
    } else {
      NODE = sprintf('%-8.8s  %-10.10s','NODE', np.prmname);
      NODE += hasInitialStorage ? sprintf('%-10.1f', np.initialstorage) : sprintf('%10s','');
      NODE += hasAreaCapFactor ? sprintf('%-10.3f', np.areacapfactor) : sprintf('%-10.3f', 0);
      NODE += hasEndingStorage ? sprintf('%-10.1f', np.endingstorage).trim() : '';
    }

    if( np.description && config.descriptions !== false ) {
      NODE += sprintf('\n%-8.8s  %-70.70s', 'ND', np.description).replace(/\s*$/,'');
    } else {
      NODE += sprintf('\n%-10.10s', 'ND');
    }

  return NODE;
};

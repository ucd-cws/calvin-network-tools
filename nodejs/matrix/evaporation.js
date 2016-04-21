'use strict';
/*
Evaporation returns the time to time amplitude for storage.  You can
use it for storage without evaporaton (like gw), and it returns 1s.
*/

module.exports = function(item,steps,hnf,callback) {
  var steps_amp=[];
  var p=items.properties;

  // defaut is no Evap, amplitude=1
  steps.forEach(function(step) {
    steps_amp.push([1]);
  });

  if (p.evaporation) {
    hnf.expand(item, ['evaporation'],function(){
      var acf = p.areacapfactor;
      var evap = item.properties.evaporation;
      var time;
      var row;
      var ev={};
      var i,b;

      // Lookup evap - could be faster
      evap.forEach(function(e) {
        ev[e[0]] = e[1];
      });

      for( i = 0; i < steps.length; i++ ){
        e = ev[steps[i]];

        if( typeof e !=='undefined' && e !== null) {
          steps_amp[i]=1-acf*e;
        }
      }
      callback(steps_amp);
    });
  } else {
    callback(steps_amp);
  }
};

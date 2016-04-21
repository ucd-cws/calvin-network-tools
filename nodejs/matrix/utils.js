/* General Utilities
*/

module.exports=function() {
  var config = require('./mconfig')();
  
  return {
    id:function(id,step) {
      return [id,step].join(config.separator||'@');
    }
  };
};

//module.exports={
//    id:function(id,step) {
//      return [id,step].join('.');
//    }
//  };

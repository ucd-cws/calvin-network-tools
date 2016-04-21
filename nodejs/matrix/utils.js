/* General Utilities
*/

module.exports=function(config) {
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

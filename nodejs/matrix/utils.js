/* General Utilities
*/

module.exports={
  id:function(id,step) {
    var config = require('./mconfig')();
    return [id,step].join(config.separator||'@');
    }
  };

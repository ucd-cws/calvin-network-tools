/*
  Expand all $refs

  network: object returned from hnf.split function
*/

var async = require('async');
var hnf = require('../hnf')();

module.exports = function(subnet, callback) {
   
   var arr = [];
   subnet.in.forEach(function(n){
     arr.push(n);
   });
   subnet.edge.in.forEach(function(n){
     arr.push(n);
   });
   subnet.edge.out.forEach(function(n){
     arr.push(n);
   });
   
   async.eachSeries(
     arr,
     (node, next) => {
       hnf.expand({node : node}, next);
     },
     (err) => {
       callback();
     }
   );
}
/**
 * Created by raychen on 16/9/12.
 */
var async = require("async");
var signal = 0, count = 24;

function circle(){
  let time = new Date().getSeconds();
  count = 60 - time;
  async.until(function() {
      return signal > 0;
    },
    function(cb) {
      //console.log('try');
      count --;
      if (count == 0) {count = 60; signal = 1;}
      setTimeout(cb, 1000);
    },
    function(err) {
      console.log('done!'+(new Date().getSeconds()));
      signal = 0;
      circle();
    });
}

//circle();
//console.log('in');
let time = new Date();
console.log(time.getHours());

'use strict';

var x = 5;
var y = {
  // doesn't use object shorthand
  x: x
};

request.post('http://mar.lint')
    // use function instead of arrow callback
    .end(function (err) {
      console.error(y, err);
      // use concat instead of template string
      console.log('a' + y.x);
    })

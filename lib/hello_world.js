var Rx = require('rx');

Rx.Observable.just('Hello world!').subscribe(function(value){
  console.log(value);
});

Rx.Observable.range(1,3).subscribe(
  function(next){
    console.log("next", next);
  },
  function(error){
    console.log("error", error);
  },
  function(nothing_here){
    console.log("completed", nothing_here);
  });

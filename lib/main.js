import _ from 'lodash';
import $ from 'jquery';
import Rx from 'rx';

var grid_x = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
var grid_y = [1, 2, 3, 4, 5, 6, 7];
var current_x = "G";
var current_y = 4;

function preload_images(url_array){
  for (var i = 0; i < url_array.length; ++i) {
     var img = new Image();
     img.src = url_array[i];
  }
}

Rx.Observable.just('Hello world!').subscribe(function(value){
  console.log(value);
});

var grid_urls = _.flatten(_.map(grid_x, function(x){
  return _.map(grid_y, function(y){
    return "http://new.fisherfairmountdesign.com/exp1/__" + x + y + ".png";
  });
}));

console.log("grid url", grid_urls);
preload_images(grid_urls);

export function go(direction) {
  var grid_x_pos = grid_x.indexOf(current_x);
  var grid_y_pos = grid_y.indexOf(current_y);
  var new_x_pos = grid_x_pos;
  var new_y_pos = grid_y_pos;
  if(direction === "right"){
    new_x_pos = grid_x_pos + 1;
    if (new_x_pos > grid_x.length - 1) {
      new_x_pos = 0;
    }
  }
  else if (direction === "left"){
    new_x_pos = grid_x_pos - 1;
    if (new_x_pos < 0) {
      new_x_pos = grid_x.length - 1;
    }
  }
  else if (direction === "up"){
    var new_y_pos = grid_y_pos - 1;
    if (new_y_pos < 0) {
      new_y_pos = grid_y.length - 1;
    }
  }
  else if (direction === "down"){
    var new_y_pos = grid_y_pos + 1;
    if (new_y_pos > grid_y.length - 1) {
      new_y_pos = 0;
    }
  }

  current_x = grid_x[new_x_pos];
  current_y = grid_y[new_y_pos];

  $("#mobox").css("background-image", "url(http://new.fisherfairmountdesign.com/exp1/__" + current_x + current_y + ".png)");
  console.log(event);
}

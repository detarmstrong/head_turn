import _ from 'lodash';
import $ from 'jquery';
import Rx from 'rx';
import RxDOM from 'rx-dom';

export function getRx(){
  return Rx;
}

var grid_x = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
var grid_y = [1, 2, 3, 4, 5, 6, 7];
var current_x = "G";
var current_y = 4;
var is_negative_y = false;

$(document).ready(function(){
  var layer_divs = _.flatten(_.map(grid_x, function(x){
    return _.map(grid_y, function(y){
      var url = "http://new.fisherfairmountdesign.com/exp1/__" + x + y + ".svg";
      var visibility;
      if(x+y === "G4"){
        visibility = "visible";
      }
      else {
        visibility = "hidden";
      }
      return $("<div/>", {id: "id_" + x + "_" + y, class: "layer"})
               //.css("background-color", "white")
               .css("background-image", "url('" + url + "')")
               .css("background-attachment", "fixed")
               .css("background-position", "50% 50%")
               .css("background-size", "contain")
               .css("background-repeat", "no-repeat")
               .css("visibility", visibility);
    });
  }));

  _.forEach(layer_divs, function(layer_div){
    $("#layerbox").append(layer_div);
  });

  $("#loading").hide();

});

export function go(direction) {
  var grid_x_pos = grid_x.indexOf(current_x);
  var grid_y_pos = grid_y.indexOf(current_y);
  var prev_x = current_x;
  var prev_y = current_y;
  var new_x_pos = grid_x_pos;
  var new_y_pos = grid_y_pos;

  switch(direction){
    case "right":
      new_x_pos = grid_x_pos + 1;
      if (new_x_pos > grid_x.length - 1) {
        new_x_pos = 0;
      }
      break;
    case "left":
      new_x_pos = grid_x_pos - 1;
      if (new_x_pos < 0) {
        new_x_pos = grid_x.length - 1;
      }
      break;
    case "up":
      if(is_negative_y){
        grid_y_pos *= -1;
      }
      new_y_pos = grid_y_pos - 1;
      if(new_y_pos < 0 && new_y_pos > (grid_y.length * -1)){
        is_negative_y = true;
      }
      else if(new_y_pos <= (grid_y.length * -1)){
        new_y_pos = grid_y.length - 1;
        is_negative_y = false;
      }
      new_y_pos = Math.abs(new_y_pos);
      break;
    case "down":
      if(is_negative_y){
        grid_y_pos *= -1;
      }
      new_y_pos = grid_y_pos + 1;
      // check if greater than bounds of grid. if so, wrap around
      if(new_y_pos >= grid_y.length && is_negative_y === false){
        new_y_pos = (grid_y.length - 1) * -1;
        is_negative_y = true;
      }
      else if(new_y_pos < 0){
        is_negative_y = true;
      }
      else{
        is_negative_y = false;
      }
      new_y_pos = Math.abs(new_y_pos);
      break;
  }

  current_x = grid_x[new_x_pos];
  current_y = grid_y[new_y_pos];

  if(is_negative_y){
    $("#id_" + current_x + "_" + current_y).css("transform", "scaleY(-1)");
  }
  else{
    $("#id_" + current_x + "_" + current_y).css("transform", "scaleY(1)");
  }

  $("#id_" + prev_x + "_" + prev_y).css("visibility", "hidden");
  $("#id_" + current_x + "_" + current_y).css("visibility", "visible");
  console.log("now at",
              current_x,
              current_y,
              $("#id_" + current_x + "_" + current_y),
             "is negative?",
             is_negative_y);
}

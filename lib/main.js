import _ from 'lodash';
import $ from 'jquery';
import Rx from 'rx';
import RxDOM from 'rx-dom';
import RxTween from 'rxtween';

export function getRx(){
  return Rx;
}

var grid_x = ["A", "B", "C", "D", "E", "F", "G", "H"];
var grid_y = [1, 2, 3, 4, 5, 6, 7, 8];
var current_x = "G";
var current_y = 4;
var is_negative_y = false;

$(document).ready(() => {
  _(grid_x).forEach((x) => {
    _(grid_y).forEach((y) => {
      let url = "images/" + x + y + ".svg";
      let visibility = (x + y === "G4") ? "visible" : "hidden";
      $.get(url,
            (data) => {
              $(data.documentElement)
                .attr("class", "layer")
                .attr("id", "id_" + x + "_" + y)
                .css("visibility", visibility)
                .appendTo("#layerbox")
                .children("image")
                .each((index, el) => {
                  let intMatrixValues = $(el)
                                          .attr("transform")
                                          .match(/(\d+\.?\d{0,})/g)
                                          .map(i => parseInt(i));
                  if(Math.max.apply(null, intMatrixValues) > 15)
                    $(el).hide();
                });
            });
      });
  });

});

function layerClickHandler(evt){
  let clickCoords = [evt.clientX,
                     evt.clientY];
  let $layerSvg = $(evt.target).closest("svg");
  let hexColor = $(evt.target).attr('fill');
  animateZoooom(clickCoords, $layerSvg, hexColor);
}

function animateZoooom(clickCoords, $svg, hexColor){
  let goingIn = RxTween({
    from: 1,
    to: 120,
    ease: RxTween.Exp.easeIn,
    duration: 1500,
    interval: 20
  });

  let isRepeated = false;

  // threshold to wait until recursion appears
  let repeatThreshold = 2;

  let zIndex = $svg.css("z-index");

  // clone the current showing node to animate it huge
  let $repeaterSvg = $svg.clone(false);
  $repeaterSvg.css({"z-index": zIndex + 1,
                    "transform-origin": clickCoords[0] + "px " +
                                        clickCoords[1] + "px"});
  $repeaterSvg.appendTo($svg.parent());

  // hide current node so repeater is visible
  $svg.css("visibility", "hidden");

  // reference the node that will zoom in from tiny, G4
  let $g4Svg = $("#id_G_4");
  $g4Svg.css({"transform": "scale(.001)"});

  goingIn.subscribe(
    function onNext(x){
      $repeaterSvg.css("transform", "scale(" + x + ")");

      if(!isRepeated && Math.floor(x) === repeatThreshold){
        // change visibility of g4 to visible and set it up to scale in
        $g4Svg.css({"z-index": zIndex + 2,
                    "transform-origin": clickCoords[0] + "px " +
                                        clickCoords[1] + "px",
                    "transition": "transform .1s",
                    "visibility": "visible"});
        isRepeated = true;
      }
      else if(x > repeatThreshold){
        let scale = x / 120;
        let transformValue = "scale(" + scale + ")";
        $g4Svg.css("transform", transformValue);
        // This is a hacky thing to make the initial appearance of the self-similar
        // smoother. Also should try playing with the time scale somehow
        if(Math.floor(x) === 3){
          $g4Svg.css("transition", "");
        }
      }

    },
    function onError(err){
      console.log(err);
    },
    function onCompleted(){
      // set bg color to color of clicked circle
      $("body").css("background-color", hexColor);

      // reset to g4
      $g4Svg.css("z-index", 1);
      current_x = "G";
      current_y = 4;

      // remove the zoomed in clone
      $repeaterSvg.remove();
    }
  );

}

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

  $("#id_" + prev_x + "_" + prev_y).css("visibility", "hidden");
  $("#id_" + current_x + "_" + current_y).css("visibility", "visible");
  console.log("now at",
              current_x,
              current_y,
              $("#id_" + current_x + "_" + current_y),
             "is negative?",
             is_negative_y);
}

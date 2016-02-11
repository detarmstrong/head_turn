import _ from 'lodash';
import $ from 'jquery';
import Rx from 'rx';
import RxDOM from 'rx-dom';
import RxTween from 'rxtween';

export function getRx(){
  return Rx;
}

var grid_x = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
var grid_y = [1, 2, 3, 4, 5, 6, 7];
var current_x = "G";
var current_y = 4;
var is_negative_y = false;

$(document).ready(() => {
  _(grid_x).forEach((x) => {
    _(grid_y).forEach((y) => {
      let url = "images/__" + x + y + ".svg";
      let visibility;
      if(x+y === "G4"){
        visibility = "visible";
      }
      else {
        visibility = "hidden";
      }
      $.get(url,
            (data) => {
              $(data.documentElement)
                .attr("class", "layer")
                .attr("id", "id_" + x + "_" + y)
                .css("visibility", visibility)
                .appendTo("#layerbox")
                .find("path")
                .not("[fill='#FFFFFF']")
                .click(layerClickHandler);
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
    duration: 2000,
    interval: 20
  });

  let repeatThreshold = 2;
  let $repeaterSvg;
  let recenteredCoords = normalizeCoords(clickCoords[0],
                                         clickCoords[1],
                                         window.innerWidth,
                                         window.innerHeight);

  $svg.css("transform-origin", clickCoords[0] + "px " + clickCoords[1] + "px");

  goingIn.subscribe(
    function onNext(x){
      $svg.css('transform',"scale(" + x + ")");

      let isRepeatThreshold = x > repeatThreshold;
      if(isRepeatThreshold && !$repeaterSvg){
        $repeaterSvg = $svg.clone(true);
        let zIndex = $svg.css("z-index");
        let translateValue = _.map(recenteredCoords, coord => (coord / .004) + "px").join(",");
        $repeaterSvg.css({"z-index": zIndex + 1,
                          "transform": "scale(.004)", // translate(" + translateValue + ")",
                          //"transform-origin": "50% 50%",
                          "transition": "transform .1s",
                          "background-color": "transparent"});
        $repeaterSvg.appendTo($svg.parent());
      }
      else if(isRepeatThreshold && $repeaterSvg){
        let scale = x / 120;
        let translateValue = _.map(recenteredCoords, coord => ((1 - scale) * coord) / scale + "px")
                              .join(",");

        let transformValue = "scale(" + scale + ")";// translate(" + translateValue + ")";
        $repeaterSvg.css("transform", transformValue);
        // This is a hacky thing to make the initial appearance of the self-similar
        // smoother. Also should try playing with the time scale somehow
        if(x > 3){
          $repeaterSvg.css("transition", "");
        }
      }

    },
    function onError(err){
      console.log(err);
    },
    function onCompleted(){
      $("body").css("background-color", hexColor);
      $svg.remove();
    }
  );

}

// translate so center circle is centered on click coords
// normalize click coords which are based on origin 0, 0 to 50% 50%
function normalizeCoords(x, y, planeWidth, planeHeight){
  var siderX = (x < planeWidth / 2) ? -1 : 1;
  var siderY = (y < planeHeight / 2) ? -1 : 1;
  var newX = Math.abs(planeWidth / 2 - x) * siderX;
  var newY = Math.abs(planeHeight / 2 - y) * siderY;

  return [newX, newY];
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

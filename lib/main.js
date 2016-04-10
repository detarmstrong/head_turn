import _ from 'lodash';
import $ from 'jquery';
import Rx from 'rx';
import RxDOM from 'rx-dom';
import RxTween from 'rxtween';

export function getRx(){
  return Rx;
}

let grid_x = ["A", "B", "C", "D", "E", "F", "G", "H"];
let grid_y = [1, 2, 3, 4, 5, 6, 7, 8];
let current_x = "G";
let current_y = 4;
let initialCoord = ['G', 4];
let loadingRegister = _.reduce(grid_x,
                               (accum, x) => {
                                 return _.reduce(grid_y,
                                                 (accum1, y) => {
                                                   accum1[[x, y]] = false;
                                                   return accum1;
                                                 },
                                                 accum);
                               },
                               {});
let is_negative_y = false;
let cycleRateMs = 150;

$(document).ready(() => {
  _(grid_x).forEach((x) => {
    _(grid_y).forEach((y) => {
      let url = "images/" + x + y + ".svg";
      let visibility = _.isEqualWith([x, y], initialCoord) ? "visible"
                                                           : "hidden";
      $.get(url,
            (data) => {
              console.log(`Received ${url}`);
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
              loadingRegister[[x, y]] = true;
              if(_.every(loadingRegister, _.identity))
                $('#loader').remove();
            });
      });
  });

  // detect device input and switch from mouseup to touchstart
  const SUPPORT_TOUCH = ('ontouchstart' in window);
  if(SUPPORT_TOUCH){
    var startEvent = 'touchstart';
    var endEvent = 'touchend';
  }
  else {
    var startEvent = 'mousedown';
    var endEvent = 'mouseup';
  }

  const mouseDown$ = Rx.Observable.fromEvent(document, startEvent);
  mouseDown$
    .do((e) => e.preventDefault())
    .map(e => e.target.id)
    .filter(x => ['left', 'up', 'right', 'down'].indexOf(x) != -1)
    .subscribe(dir => {
      go(dir);
      Rx.Observable
        .just(dir)
        .delay(300)
        .takeUntil(Rx.Observable.fromEvent(document, endEvent))
        .flatMap(_ => {
          return Rx.Observable
                   .interval(cycleRateMs)
                   .takeUntil(Rx.Observable.fromEvent(document, endEvent));
        })
        .subscribe(go.bind(undefined, dir));
    });

  const keyDown$ = Rx.Observable.fromEvent(document, 'keydown');
  keyDown$
    .throttle(cycleRateMs)
    .map(e => {
      let dir;
      switch(e.which){
        case 37:
        case 65:
          dir = 'left';
          break;
        case 38:
        case 87:
          dir = 'up';
          break;
        case 39:
        case 68:
          dir = 'right';
          break;
        case 40:
        case 83:
          dir = 'down';
          break;
      }
      return dir;
    })
    .filter(x => ['left', 'up', 'right', 'down'].indexOf(x) != -1)
    .subscribe(go);

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

  $("#id_" + prev_x + "_" + prev_y).css("visibility", "hidden");
  $("#id_" + current_x + "_" + current_y).css("visibility", "visible");
  console.log("now at",
              current_x,
              current_y,
             "is negative?",
             is_negative_y);
}

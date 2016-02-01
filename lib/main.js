import _ from 'lodash';
import $ from 'jquery';
import Rx from 'rx';
import RxDOM from 'rx-dom';
import RxTween from 'rxtween';

export function getRx(){
  return Rx;
}


$(document).ready(function(){
  $("#Layer_1 path").not("[fill='#FFFFFF']").each(function(){

    $(this).unbind();
    $(this).click(function(evt){
    //zoom to point clicked
      //get coordinates of click
      var hexColor = $(evt.target).attr('fill');
      var clickCoords = [evt.clientX,
                         evt.clientY];
      var $layerSvg = $(evt.target).closest("svg");
      //zoom svg such that the color clicked takes up entire screen
      animateZoooom(clickCoords, $layerSvg, hexColor);

    });
  });
});

function animateZoooom(clickCoords, $svg, hexColor){
  $svg.css("transform-origin", clickCoords[0] + "px " + clickCoords[1] + "px");

  let goingIn = RxTween({
    from: 1,
    to: 140,
    ease: RxTween.Exp.easeIn,
    duration: 2000,
    interval: 20
  });

  let comingOut = RxTween({
    from: .01,
    to: 1,
    ease: RxTween.Exp.easeOut,
    duration: 1500,
    interval: 20
  });

  goingIn.subscribe(
    function onNext(x){
      console.log(x);
      $svg.css('transform',"scale(" + x + ")");
    },
    function onError(err){
      console.log(err);
    },
    function onCompleted(){
      console.log("complete!")

      $("body").css("background-color", hexColor);

      // Reset origin to 50% 50%
      $svg.css("transform-origin", "50% 50%");

      // Set scale to .01
      $svg.css("transform", "scale(.01)");

      // Animate scale from .01 to 1
      comingOut.subscribe(
        function onNext(x){
          console.log(x);
          $svg.css('transform',"scale(" + x + ")");
        },
        function onError(err){
          console.log(err);
        },
        function onCompleted(){
          console.log("complete!");
        });

    }
  );

  //$svg.animate(
  //  { textIndent: 140 },
  //  {step:
  //    function(now, fx) {
  //      console.log(now);
  //      $svg.css('transform',"scale(" + Math.max(1, now) + ")");
  //    },
  //   duration: 4000
  //  },
  //  'swing');
}


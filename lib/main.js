import _ from 'lodash';
import $ from 'jquery';
import Rx from 'rx';
import RxDOM from 'rx-dom';
import RxTween from 'rxtween';

export function getRx(){
  return Rx;
}

$(document).ready(function(){
  // Let click on bg of svg go through
  // to the dpad layer below
  $("#Layer_1 path").not("[fill='#FFFFFF']").each(function(){
    $(this).click(function(evt){
      let hexColor = $(evt.target).attr('fill');
      let clickCoords = [evt.clientX,
                         evt.clientY];
      let $layerSvg = $(evt.target).closest("svg");
      animateZoooom(clickCoords, $layerSvg, hexColor);
    });
  });
});

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


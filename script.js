let repeller = {
  x: 0,
  y: 0
};
document.addEventListener('mousemove', function (e) {
  getCursorPos(e, false);
});
document.addEventListener('touchmove', function (e) {
  getCursorPos(e, true);
});
function getCursorPos(e, isTouch) {
  const pointer = isTouch ? e.targetTouches[0] : e;
  repeller.x = pointer.clientX;
  repeller.y = pointer.clientY;
}

let balloons = Array.from(document.querySelectorAll('.balloon'));
let balloonCanvas = {
  w: window.innerWidth,
  h: window.innerHeight
};


balloons.forEach(function (b, idx) {

  TweenMax.to(b, 0.1, {
    opacity: 1
  });
  let balloon = {
    travel: b,
    interact: b.querySelector('.balloon-interact'),
    swing: b.querySelector('.balloon-swing'),
    circle: b.querySelector('circle')
  };
  TweenMax.set(balloon.travel, {
    scale: Math.max(idx / (balloons.length - 1), 0.5),
    transformOrigin: 'center center',
    x: random(balloonCanvas.w * 0.05, balloonCanvas.w * 0.95),
    y: random(balloonCanvas.h * 0.15, balloonCanvas.h * 0.7)
  });
  TweenMax.set(balloon.swing, {
    rotation: 0,
    transformOrigin: '55% 30%',
    attr: { "fill": getRandomColor() }
  });
  const travelDur = Math.random() * 40 + 60;
  trajectory();
  function trajectory() {
    TweenMax.to(balloon.travel, travelDur, {
      bezier: {
        curviness: 2,
        values: getRandomCoordinates()
      },
      onComplete: trajectory,
      ease: Linear.easeNone
    });
  }
  TweenMax.delayedCall(random(0,1), swing, [balloon.swing]);
  balloon.circle.addEventListener('mouseover', checkHit);
  balloon.circle.addEventListener('click', checkHit);
  function checkHit() {
    const balloonPosition = {
      x: balloon.travel._gsTransform.x + 25,
      y: balloon.travel._gsTransform.y + 20.5
    };
    let dx = repeller.x - balloonPosition.x;
    let dy = repeller.y - balloonPosition.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    if (dist < 5) {
      dx = 5 * Math.cos(angle);
      dy = 5 * Math.sin(angle);
    }
    if (dist > 50) {
      dx = 50 * Math.cos(angle);
      dy = 50 * Math.sin(angle);
    }
    TweenMax.killTweensOf(balloon.interact);
    TweenMax.killTweensOf(balloon.swing);
    TweenLite.to(balloon.interact, 0.5, {
      x: -dx * (dist < 5 ? 5 : 1.5),
      y: -dy * (dist < 5 ? 5 : 1.5),
      ease: Power2.easeOut
    });
    TweenLite.to(balloon.interact, 2.5, {
      delay: 0.5,
      x: 0,
      y: 0
    });
    updateColor(balloon.swing);
    TweenMax.to(balloon.swing, 0.2, {
      rotation: Math.cos(angle) * 20,
      ease: Power0.easeInOut,
    });
    TweenMax.to(balloon.swing, 0.6, {
      delay: 0.3,
      rotation: -Math.cos(angle) * 12,
      ease: Power1.easeInOut,
    });
    TweenMax.to(balloon.swing, 0.6, {
      delay: 0.9,
      rotation: Math.cos(angle) * 8,
      ease: Power1.easeInOut,
    });
    TweenMax.to(balloon.swing, 0.8, {
      delay: 1.5,
      rotation: -Math.cos(angle) * 2,
      ease: Power1.easeInOut,
    });
    TweenMax.to(balloon.swing, 1.3, {
      delay: 2.3,
      rotation: -Math.cos(angle),
      ease: Power1.easeInOut,
      onComplete: swing,
      onCompleteParams: [balloon.swing]
    });
  }
});
function swing(object) {
  let rot = 5;
  let dur = 1.1;
  TweenMax.to(object, dur, {
    delay: 0.15,
    rotation: -rot,
    ease: Power1.easeInOut
  });
  TweenMax.to(object, dur, {
    delay: dur + 0.3,
    rotation: rot,
    ease: Power1.easeInOut,
    onComplete: swing,
    onCompleteParams: [object]
  });
}
function getRandomCoordinates() {
  return [ {
    x: random(balloonCanvas.w * 0.1, balloonCanvas.w * 0.9),
    y: random(balloonCanvas.h * 0.15, balloonCanvas.h * 0.6),
  }, {
    x: random(balloonCanvas.w * 0.1, balloonCanvas.w * 0.9),
    y: random(balloonCanvas.h * 0.15, balloonCanvas.h * 0.6),
  }, {
    x: random(balloonCanvas.w * 0.1, balloonCanvas.w * 0.9),
    y: random(balloonCanvas.h * 0.15, balloonCanvas.h * 0.6),
  }, {
    x: random(balloonCanvas.w * 0.1, balloonCanvas.w * 0.9),
    y: random(balloonCanvas.h * 0.15, balloonCanvas.h * 0.6),
  }, {
    x: random(balloonCanvas.w * 0.1, balloonCanvas.w * 0.9),
    y: random(balloonCanvas.h * 0.15, balloonCanvas.h * 0.6),
  }]
}
function updateColor(object) {
  TweenMax.to(object, 0.5, {
    attr: { "fill": getRandomColor() }
  });
}
function getRandomColor() {
  return "hsl(" + random(0, 360) + ',' +
    random(60, 80) + '%,' +
    '45%)'
}
function random(min, max) {
  return min + Math.floor( Math.random() * (max - min));
}

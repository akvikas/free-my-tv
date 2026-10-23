(function () {
  var canvas = document.getElementById('portfolioStars');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var w = (canvas.width = 1920);
  var h = (canvas.height = 1080);

  // Cosmic starfield matching Vikas AK portfolio background
  var stars = [];
  var NUM_STARS = 95;
  for (var i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: (Math.random() - 0.5) * w * 1.6,
      y: (Math.random() - 0.5) * h * 1.6,
      z: Math.random() * 900 + 100,
      sz: Math.random() * 1.6 + 0.8,
      speed: Math.random() * 0.35 + 0.12,
      alpha: Math.random() * 0.55 + 0.3
    });
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    // Draw cosmic cyan starfield
    for (var i = 0; i < NUM_STARS; i++) {
      var s = stars[i];
      s.z -= s.speed;
      if (s.z <= 10) {
        s.z = 1000;
        s.x = (Math.random() - 0.5) * w * 1.6;
        s.y = (Math.random() - 0.5) * h * 1.6;
      }
      var sx = (s.x / s.z) * 520 + w / 2;
      var sy = (s.y / s.z) * 520 + h / 2;
      if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
        var size = (1 - s.z / 1000) * s.sz * 2.0;
        ctx.fillStyle = 'rgba(77, 225, 255, ' + (s.alpha * (1 - s.z / 1000)) + ')';
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.6, size), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();

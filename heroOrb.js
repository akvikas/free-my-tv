/*
 * Hero 3D Orbit Sphere from Vikas AK Portfolio (https://akvikas.github.io/3d-portfolio)
 * Ported directly from HeroOrb component (Three.js WebGL).
 */
(function () {
  'use strict';

  var canvas = document.getElementById('heroOrbCanvas');
  if (!canvas || typeof window.THREE === 'undefined') return;

  var width = canvas.width || 620;
  var height = canvas.height || 620;

  // Scene & Camera matching portfolio (fov: 45, camera position z: 5.4)
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 5.4);

  // WebGL Renderer with alpha transparency and antialiasing
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  } catch (e) {
    return;
  }

  var mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Outer Glowing Wireframe Icosahedron (portfolio: icosahedronGeometry(1.15, 2), color #4de1ff)
  var icoGeo = new THREE.IcosahedronGeometry(1.15, 1);
  var icoMat = new THREE.MeshBasicMaterial({
    color: 0x4de1ff,
    wireframe: true,
    transparent: true,
    opacity: 0.52
  });
  var icoMesh = new THREE.Mesh(icoGeo, icoMat);
  mainGroup.add(icoMesh);

  // 2. Inner Glowing Pulsing Core Sphere (portfolio: sphereGeometry(0.6), color #2a7fff)
  var coreGeo = new THREE.SphereGeometry(0.6, 24, 24);
  var coreMat = new THREE.MeshBasicMaterial({
    color: 0x2a7fff,
    transparent: true,
    opacity: 0.38
  });
  var coreMesh = new THREE.Mesh(coreGeo, coreMat);
  mainGroup.add(coreMesh);

  // 3. First Tilted Orbit Ring (portfolio: torusGeometry(1.75, 0.012), rotation [1.2, 0, 0], color #4de1ff)
  var ring1Geo = new THREE.TorusGeometry(1.75, 0.013, 8, 96);
  var ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x4de1ff,
    transparent: true,
    opacity: 0.65
  });
  var ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.set(1.2, 0, 0);
  mainGroup.add(ring1);

  // 4. Second Tilted Orbit Ring (portfolio: torusGeometry(2.1, 0.008), rotation [0, 1.1, 0], color #3b82f6)
  var ring2Geo = new THREE.TorusGeometry(2.1, 0.009, 8, 96);
  var ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.5
  });
  var ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.set(0, 1.1, 0);
  mainGroup.add(ring2);

  // 5. Orbiting Satellites / Moons (portfolio D parameters: d: distance, sp: speed, t: tilt)
  var orbitDefs = [
    { d: 1.75, a: 0,   sp: 0.012, t: 0.4 },
    { d: 2.1,  a: 2.1, sp: 0.008, t: 0.9 },
    { d: 1.45, a: 4.2, sp: 0.016, t: 1.4 }
  ];

  var moonGeo = new THREE.SphereGeometry(0.065, 12, 12);
  var moonMat = new THREE.MeshBasicMaterial({
    color: 0xbff4ff
  });

  var moons = [];
  for (var i = 0; i < orbitDefs.length; i++) {
    var moon = new THREE.Mesh(moonGeo, moonMat);
    moons.push(moon);
    mainGroup.add(moon);
  }

  // 6. Sparkling Floating Particles (portfolio Sparkles: count ~45, scale 5, color #8fe9ff)
  var sparkleCount = 45;
  var sparkleGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(sparkleCount * 3);
  var speeds = new Float32Array(sparkleCount);
  var phases = new Float32Array(sparkleCount);

  for (var p = 0; p < sparkleCount; p++) {
    positions[p * 3 + 0] = (Math.random() - 0.5) * 4.6;
    positions[p * 3 + 1] = (Math.random() - 0.5) * 4.6;
    positions[p * 3 + 2] = (Math.random() - 0.5) * 4.6;
    speeds[p] = 0.4 + Math.random() * 0.6;
    phases[p] = Math.random() * Math.PI * 2;
  }
  sparkleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  var sparkleMat = new THREE.PointsMaterial({
    color: 0x8fe9ff,
    size: 0.055,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  var sparkles = new THREE.Points(sparkleGeo, sparkleMat);
  scene.add(sparkles);

  // Animation Loop matching portfolio HeroOrb exact velocity & dynamics
  var startTime = Date.now();

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    var elapsed = (Date.now() - startTime) * 0.001;

    // Continuous group rotation
    mainGroup.rotation.y += 0.0035;

    // Rings rotation
    ring1.rotation.z += 0.004;
    ring2.rotation.x += 0.003;

    // Core sphere pulse: 1 + 0.07 * sin(t * 1.4)
    var pulse = 1.0 + 0.07 * Math.sin(elapsed * 1.4);
    coreMesh.scale.set(pulse, pulse, pulse);

    // Update orbiting moons along their elliptical 3D trajectories
    for (var m = 0; m < orbitDefs.length; m++) {
      var o = orbitDefs[m];
      o.a += o.sp;
      moons[m].position.set(
        Math.cos(o.a) * o.d,
        Math.sin(o.a) * o.d * Math.sin(o.t),
        Math.sin(o.a) * o.d * Math.cos(o.t)
      );
    }

    // Sparkles gentle oscillation
    var posAttr = sparkleGeo.attributes.position;
    var posArr = posAttr.array;
    for (var k = 0; k < sparkleCount; k++) {
      posArr[k * 3 + 1] += Math.sin(elapsed * speeds[k] + phases[k]) * 0.0018;
    }
    posAttr.needsUpdate = true;

    // Gentle idle sway
    mainGroup.rotation.x = Math.sin(elapsed * 0.7) * 0.08;
    mainGroup.position.x = Math.sin(elapsed * 0.5) * 0.12;
    mainGroup.position.y = Math.cos(elapsed * 0.6) * 0.08;

    renderer.render(scene, camera);
  }

  requestAnimationFrame(renderFrame);
})();

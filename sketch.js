let osc;
let particles = [];
let currentVolume = 0; // track volume for particles
let brushType = 1; // 1: circle, 2: triangle, 3: star

function setup() {
  createCanvas(800, 500);
  background(0);

  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
}

function draw() {
  background(0, 20); // trails

  // draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }

  if (mouseIsPressed) {
    let r = map(mouseX, 0, width, 50, 255);
    let g = map(mouseY, 0, height, 50, 255);
    let b = random(100, 255);

    stroke(r, g, b, 200);
    strokeWeight(12);

    // Draw different brush shapes
    drawBrush(pmouseX, pmouseY, mouseX, mouseY, brushType, color(r,g,b));

    let freq = map(mouseX, 0, width, 200, 900);
    let speed = dist(mouseX, mouseY, pmouseX, pmouseY);
    let volume = map(speed, 0, 50, 0, 0.5);
    currentVolume = volume;

    osc.freq(freq);
    osc.amp(volume, 0.1);

    // add particles
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(mouseX, mouseY, color(r, g, b), currentVolume));
    }

  } else {
    osc.amp(0, 0.1);
    currentVolume = 0;
  }
}

function drawBrush(x1, y1, x2, y2, type, col) {
  noFill();
  stroke(col);
  switch(type) {
    case 1: // circle
      line(x1, y1, x2, y2);
      break;
    case 2: // triangle
      let size = 20;
      push();
      translate(x2, y2);
      rotate(frameCount * 0.05);
      triangle(-size, size, 0, -size, size, size);
      pop();
      break;
    case 3: // star
      let s = 10;
      push();
      translate(x2, y2);
      rotate(frameCount * 0.05);
      beginShape();
      for (let i = 0; i < 5; i++) {
        let angle = i * TWO_PI / 5 - HALF_PI;
        let sx = cos(angle) * s;
        let sy = sin(angle) * s;
        vertex(sx, sy);
        angle += TWO_PI / 10;
        sx = cos(angle) * s/2;
        sy = sin(angle) * s/2;
        vertex(sx, sy);
      }
      endShape(CLOSE);
      pop();
      break;
  }
}

function mousePressed() {
  userStartAudio();
}

class Particle {
  constructor(x, y, col, volume) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.life = 50;
    this.col = col;
    this.baseSize = random(4, 8);
    this.volume = volume;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  show() {
    noStroke();
    let size = this.baseSize + this.volume * 20;
    fill(this.col.levels[0], this.col.levels[1], this.col.levels[2], this.life * 5);
    ellipse(this.x, this.y, size);
  }
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    background(0);
    particles = [];
  }
  if (key === '1') brushType = 1;
  if (key === '2') brushType = 2;
  if (key === '3') brushType = 3;
  if (key === 's' || key === 'S') saveCanvas('music_paint', 'png');
  if (key === 'q') osc.setType('sine');
  if (key === 'w') osc.setType('square');
  if (key === 'e') osc.setType('triangle');
}
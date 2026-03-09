let osc;
let particles = [];
let currentVolume = 0; // track volume for particles

function setup() {
  createCanvas(800, 500);
  background(0);

  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
}

function draw() {
  // fade background slightly for trailing effect
  background(0, 20);

  // draw all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  if (mouseIsPressed) {

    // glow stroke
    let r = map(mouseX, 0, width, 50, 255);
    let g = map(mouseY, 0, height, 50, 255);
    let b = random(100, 255);

    stroke(r, g, b, 200);
    strokeWeight(12);
    line(pmouseX, pmouseY, mouseX, mouseY);

    // sound frequency
    let freq = map(mouseX, 0, width, 200, 900);

    // volume based on speed
    let speed = dist(mouseX, mouseY, pmouseX, pmouseY);
    let volume = map(speed, 0, 50, 0, 0.5);
    currentVolume = volume; // store current volume for particles

    osc.freq(freq);
    osc.amp(volume, 0.1);

    // add particles at mouse
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(mouseX, mouseY, color(r, g, b), currentVolume));
    }

  } else {
    osc.amp(0, 0.1);
    currentVolume = 0;
  }
}

// unlock audio on first click
function mousePressed() {
  userStartAudio();
}

// Particle class
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
    // particle size pulses with sound volume
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
  if (key === '1') osc.setType('sine');
  if (key === '2') osc.setType('square');
  if (key === '3') osc.setType('triangle');
  if (key === 's' || key === 'S') saveCanvas('music_paint', 'png');
}
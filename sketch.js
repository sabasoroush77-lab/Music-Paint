let osc;

function setup() {

  createCanvas(800, 500);
  background(0);

  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);

}

function draw() {

  if (mouseIsPressed) {

    // color generation
    let r = map(mouseX, 0, width, 50, 255);
    let g = map(mouseY, 0, height, 50, 255);
    let b = random(100, 255);

    stroke(r, g, b);
    strokeWeight(8);

    line(pmouseX, pmouseY, mouseX, mouseY);

    // sound frequency
    let freq = map(mouseX, 0, width, 200, 900);

    // sound volume based on movement speed
    let speed = dist(mouseX, mouseY, pmouseX, pmouseY);
    let volume = map(speed, 0, 50, 0, 0.5);

    osc.freq(freq);
    osc.amp(volume, 0.1);

  } else {

    osc.amp(0, 0.1);

  }

}

function mousePressed() {
  userStartAudio();
}

function keyPressed() {

  if (key === 'c' || key === 'C') {
    background(0);
  }

  if (key === '1') {
    osc.setType('sine');
  }

  if (key === '2') {
    osc.setType('square');
  }

  if (key === '3') {
    osc.setType('triangle');
  }

  if (key === 's' || key === 'S') {
    saveCanvas('music_paint', 'png');
  }

}
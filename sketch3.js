var wave, playing, freq, amp, toneText, bubble,img,keyMax;
var buttons = [];
var bubbles = [];

function setup() {
  let canvs = createCanvas(400, 400);
 //reference container in index.html
  canvs.parent('container3');
  //attack/decay/sustain/release----sound-------------//
  env = new p5.Env();
  env.setADSR(0.05, 0.1, 0.5, 1);
  env.setRange(1.2, 0);

  wave = new p5.Oscillator("sine");
  wave.amp(env); //-------------------------------------//

  //number of keys
  keyMax = 8;
  for (let i = 0; i < 8; i++) {
    buttons[i] = createButton("tone" + (i + 1));
     buttons[i].parent('container3');
    buttons[i].size(width / keyMax, 150);
    // buttons[i].mousePressed(playTone);
    //to allow parameters in function call, use method below
    buttons[i].mousePressed(() => {
      playTone(i);
      spawnBubble(i);
    });
  }

   img = createImage(230, 230);
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let a = map(y, 0, img.height, 255, 0);
      img.set(x, y, [0, 153, 204, a]);
    }
  }
  img.updatePixels();
  
  toneText = "tone text";
  bubble = new Bubble(width / 2, height / 2);
}

function draw() {
  background(220);
 image(img, 90, 80);
  
  push();
  textSize(24);
  textAlign(CENTER);
  text("scale of sacred sounds", width / 2, 50);
  pop();
  push();
  textSize(16);
  text(toneText, 50, height - 50);
  pop();
  if (playing) {
    // smooth the transitions by 0.1 seconds
    //wave.freq(freq, 0.1);
    // wave.amp(amp, 0.1);
  }
  for (var i = 0; i < bubbles.length; i++) {
    bubbles[i].jiggle();    
    bubbles[i].show();
    //rise needs to be last because of(splice)
    bubbles[i].rise();
  }
  bubble.jiggle();
  bubble.show();
  //
  if(isKeyPressed){
    print(bubbles.length+ " lil' bubbles");
  }
}

function mouseReleased() {
  // ramp amplitude to 0 over 1 seconds
  wave.amp(0, 1.2);
  env.triggerRelease(wave);
  playing = false;
}

function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  wave.start();
  env.triggerAttack();
  playing = true;
}

function playTone(index) {
  
  switch(index){
    case 0: setFrequency(256);
      break;
      case 1: setFrequency(360);
      break;
      case 2:setFrequency(424);
      break;
      case 3: setFrequency(432);
      break;
      case 4: setFrequency(440);
      break;
      case 5: setFrequency(512);
      break;
      case 6: setFrequency(528);
      break;
      case 7: setFrequency(640);
      break;
      default: print("no frequency");
  }
 
  //{setFrequency(8);}//fundamentaltone-below hearing threshold
  //volume
  wave.amp(0.5);
  playOscillator();
  textDisplay();
}

function setFrequency(f) {
  wave.freq(f);
}

function spawnBubble(iter) {
  
  let pointX =  25+ (width/keyMax * iter);
  let pointY = height-30; 
  bubbles.push(new Bubble(pointX, pointY,4));

  print(iter + "iter");
}

function textDisplay() {
  //change text
  toneText = "tone frequency " + wave.getFreq();
}

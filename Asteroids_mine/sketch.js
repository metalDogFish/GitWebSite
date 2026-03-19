let ast;
let angle = 0;
let asteroids = [];
let lasers = [];
var targets = [];
let polyVertices = [];
let shipVerts = [];
let explosions = [];
let vlength = 6;
let ship;
let saucer;
let polyHit = false;
//let gameState = "intro";
const GameState = { INTRO: 0, RUNGAME: 1, ENTERNAME: 2, ENDGAME: 3 };
Object.freeze(GameState); // make GameState more or less like an enum
let gameState = GameState.INTRO;
let score = 0;
let font;
let extraLives = 3;
let isExploding = false;
let debrisSpot; //ship debris
let round = 1;
let toneHi = false;
let boxPat = [1, 0, 1, 0, 1, 0, 1, 0];
let drumPat = [0, 1, 0, 1, 0, 1, 0, 1];
let myPart;
//const sounds = {};
let sPic, banner, bgPoster;
let clock = 0;
let highScoreData;
let hScores;
let lowestHighScore;
let highestScore;
let userInput;
let userButt;
let userName;
let isSoundOn;
let soundBut;
let soundRadioBut;
let wonHiScore = false;
let thrustSound, fireSound, bang1, bang2, bang3, beat1, beat2,beatSound;
let bigSaucerFx, smallSaucerFx;
//use this to speed up bg sfx
let frameModNum = 60;
let respawnTimer = 0;
//soundeffects
let sfx1, sfx2;
let tempoInt = 0;
let myBPM = 20;

/*

function loadData(scoresData) {
  highScoreData = [];
  for (let score of scoresData) {
    let name = scoresData.name;
    let score = scoresData.score;
  }
  highScoreData.push(new Score(name, score));
}
*/
//--can Dong class solve the sound problem after 10000 points?--
// Each instance of this class is an HTML Audio element
// I used only built in JS methods so the distortion
// should be gone. You will get clipping by playing
// these all simultaneously so I reduced the volume to 0.2.
/*
class Dong {
  constructor(pitch) {
    this.pitch = pitch;
  }
  
  play() {
    let s = new Audio('./assets/gong.wav');
    s.mozPreservesPitch = false;
    s.preservesPitch = false;
    s.volume = 0.2;    // Reduced volume to avoid clipping
    s.playbackRate = this.pitch
    s.play();
  }
  
}
*/
class SoundFX {
  constructor(num) {
    this.num = num;
  }
  play() {
    switch (this.num) {
      case 1:
        console.log("1");
        let s1 = new Audio("Asteroids_mine/beat1.wav");
        s1.play();
        break;
      case 2:
        let s2 = new Audio("Asteroids_mine/beat2.wav");
        console.log("s2");
        s2.play();
        break;
      case 3:
        let s3 = new Audio("Asteroids_mine/laser.wav");
        s3.play();
        console.log("3");
        break;
      case 4:
        let s4 = new Audio("Asteroids_mine/bang1.wav");
        s4.volume = 0.5;
        s4.play();
        console.log("4");
        break;
      case 5:
        console.log("5");
        let s5 = new Audio("Asteroids_mine/bang2.wav");
        s5.volume = 0.5;
        s5.play();
        break;
      case 6:
        let s6 = new Audio("Asteroids_mine/bang3.wav");
        s6.volume = 0.5;
        s6.play();
        console.log("6");
        break;
    }
  }
}

class soundFX2 {
  constructor() {
    this.beat1 = new Audio("Asteroids_mine/beat1.wav");
    this.beat2 = new Audio("Asteroids_mine/beat2.wav");
   // this.beat3 = loadSound("Asteroids_mine/beat1.wav");
    this.boxPat = [1, 0, 1, 0, 1, 0, 1, 0];
    this.drumPat = [0, 1, 0, 1, 0, 1, 0, 1];
    this.boxPhrase = new p5.Phrase("box", this.playBoxx, this.boxPat);
    this.drumPhrase = new p5.Phrase("drum", this.playDrumm, this.drumPat);
    myPart = new p5.Part();
    myPart.addPhrase(this.boxPhrase);
    myPart.addPhrase(this.drumPhrase);
    
    //assign to self
    this.myPart = myPart;
    
    print("born "+this.beat1.playbackRate);
  }
  //functions
  playBoxx(time, playbackRate) {
     hiTone.rate(playbackRate);
   // sfx1.rate = (playbackRate);no
    //this.beat1.rate(playbackRate);//crash-undefined(reading 'rate')
   // this.beat1.playbackRate = playbackRate;//-undefined(setting 'playbackRate')
      //sfx1.paybackRate = playbackRate;//no lag, but sounds offbeat? 
    
    hiTone.play(time);
    //sfx1.play(time);
    //this.beat1.play(time);
    toneHi = true;
  }

  playDrumm(time, playbackRate) {
    loTone.rate(playbackRate);
    //sfx2.rate = (playbackRate);
     // sfx2.paybackRate = playbackRate;//no lag, but sounds offbeat? 
   // this.beat2.rate(playbackRate);
   // this.beat2.playbackRate = playbackRate;
    //this.beat3.rate(playbackRate);
  
   // this.beat2.play(time);
    loTone.play(time);
   // sfx2.play(time);//sounds uneven
    toneHi = false;
  }
}


function preload() {
  soundFormats("mp3", "wav");
  //fireSound = loadSound("laser.wav");
  hiTone = loadSound("Asteroids_mine/beat1.wav");
  loTone = loadSound("Asteroids_mine/beat2.wav");
  sfx1 = new SoundFX(1); //beat1
  sfx2 = new SoundFX(2); //beat2
  //use new design.
   beatSound = new soundFX2();
  
  fireSound = new SoundFX(3);

  thrustSound = loadSound("Asteroids_mine/thrust.wav");
  //thrustSound = new SoundFX(4);problems with looping here

  // sounds["thrust"] = loadSound("thrust.wav");
  //  sounds["thrust"].playMode("untilDone");
  //bang1 = loadSound("bang1.wav");
  bang1 = new SoundFX(4);
  //bang2 = loadSound("bang2.wav");
  bang2 = new SoundFX(5);
  //bang3 = loadSound("bang3.wav");
  bang3 = new SoundFX(6);

 

  bigSaucerFx = loadSound("Asteroids_mine/saucerBig.wav");
  bigSaucerFx.setVolume(0.7);
  smallSaucerFx = loadSound("Asteroids_mine/saucerSmall.wav");
  smallSaucerFx.setVolume(0.5);

  // gameOver = loadSound('gameover.wav');
  //load font
  font = loadFont("Asteroids_mine/Hyperspace.otf");
  sPic = loadImage("Asteroids_mine/clicktostart.png");
  banner = loadImage("Asteroids_mine/AstroidBanner.png");
  bgPoster = loadImage("Asteroids_mine/astroidCover.png");
}
////////////////////////////////////////////////setup
function setup() {
 let canv = createCanvas(500, 500);
  canv.parent("sketch_container4");
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER);
  // angleMode(DEGREES);//things get wierd
  //colorMode(HSB,360,100,100,100);
  // Resize the image, keeping the aspect ratio.
  sPic.resize(0, 60);
  bgPoster.filter(BLUR, 6, false);
  //bgPoster.filter(INVERT)
  //bgPoster.filter(ERODE);
  //bgPoster.filter(POSTERIZE);

  textFont(font);
  // Style the circle using shadows.
  // drawingContext.shadowOffsetX = 5;
  // drawingContext.shadowOffsetY = -5;
  drawingContext.shadowBlur = 20; //8; //6; //10;
  drawingContext.shadowColor = "white";

  //start with 3
  ast = new Asteroid(width, height / 2, "square");
  ast2 = new Asteroid(width, height / 2, "vertex");
  ast3 = new Asteroid(width, height / 2, "vertex");
  asteroids.push(ast);
  asteroids.push(ast2);
  asteroids.push(ast3);

  ship = new Ship();
  saucer = new Saucer();
  saucer.active = false;

  isSoundOn = true;

 // let boxPhrase = new p5.Phrase("box", playBox, boxPat);
  //let drumPhrase = new p5.Phrase("drum", playDrum, drumPat);
 // myPart = new p5.Part();
 // myPart.addPhrase(boxPhrase);
 // myPart.addPhrase(drumPhrase);
 // myPart.setBPM(20);
  
  beatSound.myPart.setBPM(20);
  //sf2.myPart.setBPM(20);
  // myPart.start();
  // myPart.loop();

  let angle = TWO_PI / vlength;
  //for (let i=0; i<vertices.length; i++) {
  for (let i = 0; i < vlength; i++) {
    let a = angle * i;
    let x = width / 4 + cos(a) * 100;
    let y = height / 2 + sin(a) * 100;
    polyVertices[i] = createVector(x, y);
  }

  shipVerts = ship.vertices;

  // Get saved data
  let savedData = getItem("hScoresAsteroid");

  // If no data has been saved yet
  if (savedData === null) {
    // Use an empty array to start
    // loadData([]);

    highScoreData = [
      { name: "Player1", score: 5120 },
      { name: "Player2", score: 2560 },
      { name: "Player3", score: 1280 },
      { name: "Player4", score: 640 },
      { name: "Player5", score: 320 },
      { name: "Player6", score: 160 },
      { name: "Player7", score: 80 },
      { name: "Player8", score: 40 },
      { name: "Player9", score: 20 },
      { name: "Player10", score: 10 },
    ];
    lowestHighScore = 10;
    highestScore = 5120;
  } else {
    // Otherwise convert the data to Bubble objects
    //loadData(savedData);
    highScoreData = savedData;
    print(savedData[0].score + ":saved Data");
    lowestHighScore = highScoreData[9].score;
    highestScore = highScoreData[0].score;
  }

  wonHiScore = false;
  // userInput = createInput("", width/2, height-100);
  userInput = createInput("");
  userInput.position(width / 3, height - 100);
  userInput.hide();
  userButt = createButton("ok");
  userButt.position((width / 3) * 2, height - 100);
  userButt.mouseClicked(hiScoreFunc);
  userButt.hide();
  // soundBut = createButton("sound");
  // soundBut.position(20, height-30);
  // soundBut.mouseClicked(soundOptionFunc);
  soundRadioBut = createRadio();
  soundRadioBut.position(10, height - 30);
  soundRadioBut.size(90);
  soundRadioBut.option("on");
  // soundRadioBut.option('sound off')
  // soundRadioBut.selected('sound off');
  soundRadioBut.mouseClicked(soundOptionFunc);
}

/////////////////////////////////////////draw
function draw() {
  if (gameState == GameState.INTRO) {
    introFunc();
  }

  if (gameState == GameState.RUNGAME) {
    gameFunc();
  }

  if (gameState == GameState.ENTERNAME) {
    enterNameFunc();
  }

  if (gameState == GameState.ENDGAME) {
    endGameFunc();
  }
}

//spacebar fire -the ship has its own input handler
//////////////////////////////input handler//////

function keyPressed() {
  if (ship.isBreaking == false) {
    if (key == " ") {
      ship.fire();
      //fireSound.play();//moved inside ship.fire
      console.log("active shots " + lasers.length);
    } else if (keyCode == RIGHT_ARROW) {
      ship.setRotation(0.05);
    } else if (keyCode == LEFT_ARROW) {
      ship.setRotation(-0.05);
    } else if (keyCode == DOWN_ARROW) {
      ship.fire();
    } else if (keyCode == UP_ARROW) {
      ship.boosting(true);
      //sfx
      if (isSoundOn) {
        thrustSound.loop();
        //thrustSound.setLoop(true);//nope
        
      }
      //thrust.play();//only plays once
    } else if (keyCode == SHIFT) {
      //reset ship
      ship.isHit = false;
      print("reset hitship "); // + debrisSpot.vecA);

      if (explosions.length > 0) {
        print("explosion " + explosions[0].particles.length);
      }
      // }
    } else if (keyCode == 78) {
      //testing all scenes
      //N
      print(" add saucer");
      saucer = new Saucer();
      //play soundfile when spawning saucer, will auto-pause when           saucer is non-active within gameloop
      let chance = random(1);
      if (chance > 0.5) {
        if (isSoundOn) {
          bigSaucerFx.loop();
        }
        saucer.size = 2;
      } else {
        if (isSoundOn) {
          smallSaucerFx.loop();
        }
        saucer.size = 1.2;
      }
      // newGameFunc();
    }
  }
}

function keyReleased() {
  ship.boosting(false);
  //sfx
  // sounds["thrust"].stop();
  if (thrustSound.isLooping) {
    thrustSound.setLoop(false); //works!
   // thrustSound.pause();
  }
  if (keyCode == SHIFT) {
    ship.resetShip();

    print("ship reset");
  }
  if (keyCode == 84) {
    //T
    let fc = frameCount;
    //frameModNum = 60;
    //resetSoundMod();
    print("frameModNum " + frameModNum + " frameCount " + fc);
  }
  //thrustSound.stop();//works, but a harsh pop during cutoff.
  // thrustSound.noLoop();
  //noLoop(thrustSound);//crash!
  // thrustSound.isLooping = false;
  ship.setRotation(0);
}

function mouseClicked() {
  //get mouse coords
  let mx = mouseX;
  let my = mouseY;
  //create new asteroid
  //let a = new Asteroid(mx, my, "vertex");
  //push into array
  //asteroids.push(a);

  //advance from into state if not already
  //if (gameState == "runGame") {
  //if (gameState == GameState.RUNGAME) {
  // gameState = "endGame";
  //} else if (gameState == "intro") {
  // } else if (gameState == GameState.INTRO) {
  if (gameState == GameState.INTRO) {
    // gameState = "runGame";
    gameState = GameState.RUNGAME;
  }
}

//////////////////////////////////game state functions//

function introFunc() {
  //clock starts at zero
  clock++;
  if (clock > 80) {
    clock = 0;
    sPic.filter(INVERT);
    //  banner.filter(INVERT);
    //bgPoster.filter(BLUR,3,false);
    //erodes image slowly to black
    bgPoster.filter(ERODE);
  }
  print("clock " + clock);
  push();
  // Style the circle using shadows.
  // drawingContext.shadowOffsetX = 5;
  // drawingContext.shadowOffsetY = -5;
  //drawingContext.shadowBlur =40; //10;
  //drawingContext.shadowColor = 'white';

  background(20);
  //textAlign(CENTER);
  textSize(68);
  stroke(100);
  //textFont("Ariel");
  //bgPoster.filter(BLUR,1,false);
  image(bgPoster, width / 2, height / 2);

  // text("Asteroids", width / 2, height / 3);
  //  text("Asteroids", width / 2, height / 3);
  //text("Asteroids", width / 2, height / 3);
  var glowColor = "white"; //color(332, 58, 91, 100);
  // function textNeon(glowColor) {
  glow(glowColor, 400);
  text("Asteroids", width / 2, height / 3);
  text("Asteroids", width / 2, height / 3);
  glow(glowColor, 80);
  text("Asteroids", width / 2, height / 3);
  text("Asteroids", width / 2, height / 3);
  glow(glowColor, 12);
  text("Asteroids", width / 2, height / 3);
  text("Asteroids", width / 2, height / 3);

  //}

  // push();
  textSize(18);
  // text("click to start", width/2,height/3*2);
  //add a pulsing mask?
  if (clock < 0) {
    //sPic.filter(BLUR,1);
  } else {
    // sPic.filter(INVERT);
  }
  // Display the image.
  image(sPic, width / 2, (height / 3) * 2);
  //banner.filter(GRAY);

  pop();
}

//--------------------------------------------game page
function gameFunc() {
  background(2);
  stroke(100);
  //hide the sound option button
  // soundBut.hide();
  //flash red on hit frame
  if (polyHit) {
    fill("red");
    polyHit = false;
  } else {
    noFill();
  }
  /*
  //draw polygon using  vertices
  beginShape();
  for (let i = 0; i < polyVertices.length; i++) {
    vertex(polyVertices[i].x, polyVertices[i].y);
    //print('v'+v);
  }
  endShape(CLOSE); //-------------end polygon----------------
*/
  //render lasers before ship for layering
  for (var i = lasers.length - 1; i >= 0; i--) {
    lasers[i].render();
    lasers[i].update(); //add collision
    // lasers[i].edges();
    if (lasers[i].expired) {
      //if expired, remove from array
      lasers.splice(i, 1);
      print("laser expired");
    } else {
      //done inside asteroid update()
      // for (var j = asteroids.length - 1; j >= 0; j--) {
      // if (lasers[i].hits(asteroids[j])) {
      // if (asteroids[j].r > 10) {
      //  var newAsteroids = asteroids[j].breakup();
      //   asteroids = asteroids.concat(newAsteroids);
      // }
      // asteroids.splice(j, 1);
      // lasers.splice(i, 1);
      // break;
      // }
    }
  }

  //draw asteroids in array, remove hit asteroid while adding 2 new smaller asteroids..
  //for(let a in asteroids){ //cycle backwards due to splice
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].update(); //---------------check for ship collion here?
    asteroids[i].drawAst();
    if (asteroids[i].isHit) {
      asteroids[i].addScore();
      print("hit");
      if (asteroids[i].r > 10) {
        var newAsteroids = asteroids[i].breakup();
        asteroids = asteroids.concat(newAsteroids);
      }
      //add explosions here
      let ds = new Explosion(asteroids[i].position);
      //push into global array from tracking
      explosions.push(ds);
      //exploBurst(ds.pos);
      //hit sound effect
      // bang1.play();
      if (isSoundOn) {
        playBangFX();
      }
      //get rid of old asteroid
      asteroids.splice(i, 1);
      break;
    }
  
  }

  //check for explosion too-works!
  if (explosions.length > 0) {
    for (var j = explosions.length - 1; j >= 0; j--) {
      explosions[j].render();
      if (explosions[j].life < 0) {
        explosions.splice(j, 1);
        break;
      }
    }
  }
  //shipn
  //if(ship.mode != 'solid'){

  ship.render();
  ship.turn();
  ship.update();
  ship.edges();

  if (saucer.active) {
    saucer.display();
    saucer.update();
    // bigSaucerFx.play();//multiple calls-not work here
  } else {
    bigSaucerFx.pause();
    smallSaucerFx.pause();
  }

  //text ontop
  //  push();
  textSize(32);
  stroke(250);
  var glowColor = "white"; //color(332, 58, 91, 100);
  // function textNeon(glowColor) {
  glow(glowColor, 400);
  text(score, width / 4, 40);
  text(score, width / 4, 40);
  glow(glowColor, 80);
  text(score, width / 4, 40);
  text(score, width / 4, 40);
  glow(glowColor, 12);
  text(score, width / 4, 40);
  text(score, width / 4, 40);

  //high score
  textSize(22);
  text(highestScore, width / 2, 30);
  //textFont("Verdana");
  //text(score, width / 4, 40);
  //pop();

  //draw extra ship triangles
  push();
  let r = 12;
  translate(width / 4 - 16, 60);
  for (let i = 0; i < extraLives; i++) {
    triangle(-r / 2 + i * 16, r / 2, 0 + i * 16, -r, r / 2 + i * 16, r / 2);
  }
  pop();

  //check if all asteroids are destroyed
  if (asteroids.length < 1) {
    print("all asteroids are destroyed");
    respawnTimer++;
    //stop BG music
    beatSound.myPart.noLoop();
    if (respawnTimer > 180) {
      respawnTimer = 0;
      respawnAsteroids(); //add a delay somehow before spawning?
    }
  } else {
    //handle bg music(jaws)
    playBeat(); //actual beat is separated into myPart,this has other uses.
    if (ship.isHit == true) {
      //myPart.stop();//nope
      
     // myPart.noLoop(); //yup
      beatSound.myPart.noLoop(); 
      myBpm = 20;
      beatSound.myPart.setBPM(myBPM);
      print("stop the music");
    } else {
     // myPart.loop();
    //  beatSound.myPart.loop();
    }
    clock = 500; //clock is used in intro and outro
  }
  //}
  //  print(" framerate "+frameRate());
} //--------------------------------------------------end game page

function enterNameFunc() {
  background(2);
  text("You achieved a high score!", width / 2, height / 3);
  text("Enter you initals below", width / 2, height / 3 + 50);

  // input()
  userInput.show();
  userButt.show();
}

function endGameFunc() {
  //add another screen to enter name
  //hide userinput
  userInput.hide();
  userButt.hide();

  if (score > lowestHighScore && wonHiScore == false) {
    let name = username; //"johnny";
    addHighScore(name, score);
    wonHiScore = true;
    //store the updated score array when a change is made
    storeItem("hScoresAsteroid", highScoreData); //done inside addHighScore()
    //track hiscore for text update
    if (score > highestScore) {
      highestScore = score;
    }
    print("highScore");
  }

  let tog; // = false;
  clock++;
  if (clock >= 500) {
    clock = -500;
    tog = false;
  }
  if (clock >= -400 && clock < -300) {
    tog = true;
  } else if (clock >= -300 && clock < -200) {
    tog = false;
  } else if (clock >= -200 && clock < -100) {
    tog = true;
  }
  //draw
  background(2);
  stroke(250);
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].update();
    asteroids[i].drawAst(100);
  }

  if (clock < 0) {
    push();
    textSize(40);
    text("GAME OVER", width / 2, height / 3);
    textSize(32);
    text(score, width / 4, 40);
    textSize(22);
    text(highestScore, width / 2, 30);
    //flashing part
    if (tog) {
      push();
      textSize(16);
      text("-insert quarter-", width / 2, height - 100);
      pop();
    }
    //
    textSize(12);
    text("Asteroid clone programmed by S.Nykwist", width / 2, height - 50);
    pop();
  } else {
    //high scores
    // push();
    drawHighScores();
    print("drawHighScorz");
    //pop();
  }
}

function addHighScore(name, score) {
  highScoreData.push({ name, score });
  highScoreData.sort((a, b) => b.score - a.score); // sort descending by score
  highScoreData = highScoreData.splice(0, 10); // limit list to 10 high scores
  lowestHighScore = highScoreData[highScoreData.length - 1].score;
  //
  storeItem("hScoresAsteroid", highScoreData);
}

function glow(glowColor, blurriness) {
  drawingContext.shadowColor = glowColor;
  drawingContext.shadowBlur = blurriness;
}

function drawHighScores() {
  text("High Scores", width / 2, 110);
  let y = 200;
  for (let s of highScoreData) {
    text(
      `${s.name.padEnd(10, " ")} ${s.score.toString().padStart(6, " ")}`,
      width / 2,
      y
    );
    y += 30;
  }
}

function debrisFunc(xvar, yvar, heading) {
  //mimick debries floating away from ship

  let pos = createVector(xvar, yvar); //this.damageArray[0];

  if (isExploding !== true) {
    debrisSpot = new DebrisSpot(pos, heading);
    isExploding = true;

    print("o" + pos);
  }
}

function hiScoreFunc() {
  //user clicks on button, copy name, goto endGame
  username = userInput.value();
  gameState = GameState.ENDGAME;
  print("username: " + username);
}

function newGameFunc() {
  asteroids = [];
  //start with 3
  ast = new Asteroid(width, height / 2, "square");
  ast2 = new Asteroid(width, height / 2, "vertex");
  ast3 = new Asteroid(width, height / 2, "vertex");
  asteroids.push(ast);
  asteroids.push(ast2);
  asteroids.push(ast3);

  ship = new Ship();

  lasers = [];
  explosions = [];

  wonHiScore = false;

  score = 0;
  extraLives = 3;
  clock = 0;

  gameState = GameState.INTRO; //this will take us out of gameover mode
}

function playBox(time, playbackRate) {
  hiTone.rate(playbackRate); //produces an even sound beat, but!
  //using hiTone based on p5.sound will invoke long term glitch. (avoid buggy p5.sound) 
   //sfx2.rate(playbackRate);//nope .rate is not a function
  //using sfx2 is a custom function using html audio class instead.
  //sfx2.playbackRate = playbackRate;  //seems to produce uneven soun beat
 
  hiTone.play(time);
   //sfx2.play(time);
 
  toneHigh = true;
}


function playDrum(time, playbackRate) {
  loTone.rate(playbackRate);//smooth, steady rythem, but gets laggy.
  //soundFX(1).rate(playbackRate);
  //sfx1.rate(playbackRate);
  //sfx1.paybackRate = playbackRate;//no lag, but sounds offbeat? unsteady rythem
  loTone.play(time);
  //soundFX(1).play(time);
 // sfx1.play(time);
  toneHi = false;
}

function playBangFX() {
  //randomize which sfx is played
  let r = floor(random(1, 3));
  if (r == 1) {
    bang1.play();
  } else if (r == 2) {
    bang2.play();
  } else {
    bang3.play();
  }
}

function playBeat() {
  //play the jaws theme with increasing tempo
  let fc = frameCount;
  //only play when ship is active
  if (ship.mode == "solid") {
    //speed up timer
    // if(fc % 200 == 0){
    //  frameModNum-= 2;
    //  print("time mod "+ frameModNum);
    // }
    //frameModNum starts near 60

    if (fc % frameModNum == 0) {
      if (isSoundOn) {
        //play alternating beat
        if (toneHi) {
          //SoundFX(2);//use custum func
           sfx2.play();
        } else {
          //beat1.play();
          //SoundFX(1);
           sfx1.play();
          //increase something
          // tempoInt++;
          // if (tempoInt >= 4) {
          //  tempoInt = 0;
          //  if (frameModNum > 8) {
          //  frameModNum -= 2;
          //   print("speeeeeedup");
          //  }
        }
        //the 2 tones all built into
      }
      //flip the bool
      toneHi = !toneHi;
    }

    //increase beat
    if (fc % 1000 == 0) {
      // frameModNum -= 1;
      // let bpm = myPart.getBPM();//problems?
      if (myBPM < 100) {
        myBPM += 5;
      }
     beatSound.myPart.setBPM(myBPM);
      print("up the beat ");
    }
    //send in saucer
    if (fc % 3000 == 0) {
      print(fc * frameModNum + " saucer sighted--");

      //add saucer
      saucer = new Saucer();
      //play soundfile when spawning saucer, will auto-pause when           saucer is non-active within gameloop
      if (score > 10000) {
        saucer.size = 1.2;
        if (isSoundOn) {
          smallSaucerFx.loop();
        }
      } else {
        saucer.size = 2;
        if (isSoundOn) {
          bigSaucerFx.loop();
        }
      }
    }
  }
  //}
}

function respawnAsteroids() {
  round++;
  //add a time delay here-dalay is implemanted before calling this func()!

  let ms = millis();
  print("respawn " + ms);
  //start with 3
  let ast;
  for (var i = 0; i < round + 2; i++) {
    if (i % 4 == 0) {
      ast = new Asteroid(width, height / 2, "vertex");
    } else if (i % 4 == 1) {
      ast = new Asteroid(0, height / 2, "vertex");
    } else if (i % 4 == 2) {
      ast = new Asteroid(width / 2, height, "vertex");
    } else if (i % 4 == 3) {
      ast = new Asteroid(width / 2, 0, "vertex");
    }
    asteroids.push(ast);
  }
  beatSound.myPart.setBPM(20); //reset speed
  myBPM = 20;
 // beatSound.myPart.loop(); //start the beat
}

function resetSoundMod() {
  print("resetSoundMod");
  //reset soundbgtimer
  frameModNum = 60;
  //myPart.setBPM(20); //reset speed
  beatSound.myPart.setBPM(20); 
  myBPM = 20;
  //myPart.stop();
}

function soundOptionFunc() {
  //switch isSoundOn bool
  isSoundOn = !isSoundOn;

  if (isSoundOn) {
    soundRadioBut.selected("on");
  } else {
    //we want to unselect only 1 radio button selection, so assign select to phantom selection to mimick 2 button logic- seems to work.
    soundRadioBut.selected("sound off");
  }
  print("sound is " + isSoundOn);
}

//these 2 functions work together, collision check between polygon-line uses line-line collision check
// POLYGON/LINE
function polyLine(vertices, x1, y1, x2, y2) {
  // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0;

    // get the PVectors at our current position
    // extract X/Y coordinates from each
    let x3 = vertices[current].x;
    let y3 = vertices[current].y;
    let x4 = vertices[next].x;
    let y4 = vertices[next].y;

    // do a Line/Line comparison
    // if true, return 'true' immediately and
    // stop testing (faster)
    let hit = lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (hit) {
      return true;
    }
  }

  // never got a hit
  return false;
}

//- used in above function
// LINE/LINE
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  // calculate the direction of the lines
  uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }
  return false;
}

class DebrisSpot {
  constructor(x, y, rot) {
    this.pos = createVector(x, y);
    this.life = 300;
    this.r = 12;
    this.rot = rot;
    this.posA = createVector(0, 0);
    this.posB = createVector(0, 0);
    this.posC = createVector(0, 0);
    //this.vecA = p5.Vector.random2D();
    //this.vecA *= 0.5;

    let angle1 = random(0, 2 * PI);
    this.xspeed1 = random(-0.3, 0.3) * Math.cos(angle1);
    this.yspeed1 = random(-0.3, 0.3) * Math.sin(angle1);

    let angle2 = random(0, 2 * PI);
    this.xspeed2 = random(-0.3, 0.3) * Math.cos(angle2);
    this.yspeed2 = random(-0.3, 0.3) * Math.sin(angle2);

    let angle3 = random(0, 2 * PI);
    this.xspeed3 = random(-0.3, 0.3) * Math.cos(angle3);
    this.yspeed3 = random(-0.3, 0.3) * Math.sin(angle3);
    print("make debris spot " + this.pos);
  }

  //update should be called before render()
  update() {
    // this.posA.add(this.vecA);
    this.posA.add(this.xspeed1, this.yspeed1);
    //this.posB.add(this.xspeed2, this.yspeed2);
    this.posC.add(this.xspeed3, this.yspeed3);
    this.life--;
  }
  //render is being called from within ship render which has already applied translate
  render() {
    if (this.life > 0) {
      //2 pieces will drift from center, 3rd piece will just rotate around spot
      // print("moving pos " + this.posA + ":" + this.xspeed1);
      //three lines will drift for a short while,-no spin here.
      line(
        -this.r + this.posA.x,
        -this.r / 2 + this.posA.y,
        -this.r + this.posA.x,
        this.r / 2 + this.posA.y
      );
      push();
      //only this piece will spin, becasue we set its drift to zero!
      rotate(frameCount * 0.02); //-add spin!
      line(
        -this.r + this.posB.x,
        this.r / 2 + this.posB.y,
        this.r + this.posB.x,
        0 + this.posB.y
      );
      pop();
      //no spin here-using spin with drift results in wierd behavior!
      line(
        this.r + this.posC.x,
        0 + this.posC.y,
        -this.r + this.posC.x,
        -this.r / 2 + this.posC.y
      );
    } else if (this.life == 0) {
      //trigger ship reset
      ship.resetShip();
      // this.remove();
    }
  }
}

/////////////////////////////////////////////Score class--------------
/*
class Score {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}

*/

//have different asteroids to represent different galaxy sectors-square,triangle,and other asteroid variations
//June102025-just added sucessful collision test to bullets hitting Big stationary polygon.
//expand this to include collision tests against an array of asteroids where the moving asteroids may have diffrent amounts of vertices.(square, triangle, polygon)
//June11-collision detection with asteroid array & bullet is working by updating vertices after movement inside asteriod.update().
//tweak the asteroid movement, vary speeds of velocity and rotation.
//design decision--
//june24-adding collision detection to asteroids against 1 ship seems cheaper than having ship collision detect through an array of multiple asteroids every frame.
//june24-asteroids break apart and repopulate asteroid array with a pair of smaller asteroids while removing the hit asteroid.
//june25-added classic asteroid sfx(rock collision, thrust, fire)
//june26-added ship collision anim with debris spot.reset ship with shift key
//june27-added classic asteroid font, added drawingContext to add glow.Using an image filter(INVERT) in the intro scene for arcade-style play btn.
//-----still to go----
//-1.add highscore scene with local data storage,-2.add bachground music theme,-3.add flying saucers,-4.add blinking ghost mode after spawning.
//2-function playBeat() handles background beats, that stop when ship dies.
//4-ship.render() handles isBlinking bool causing ship to blink for 3 secs. While blinking,ship is untouchable but cannot fire.
//june28-found the original specs for ship, incorperated using a verticeArray[] and beginShape(). Also using classic poster in intro scene, with a blur and increasing filter(ERODE) is giving a cool effect that helps the title pop.found a cool hack to simulate neon lighting involving multiple layering.
//july2-noticed lag creeping in, check framerate, new rendering hack may taxxing system too much. framerate is near 60, but visually, animation is choppy? internet conection? reduced asteroid render calls without noticable difference. now what?
//july3-fixed explosion with seperate particle class that gets created inside explosion constructor-bug alert!sound cuts out after 3 rounds. may need custum sound class to rectify this..
//july4-early morning testing reveals no game lag today, so internet connection is a considerable factor when play testing. lets move on to adding a highscore table.
//july7-free spaceship every 10k, After 10,000 points, the small saucer becomes a permanent part of the game. You can no longer sit in one place since the small saucer is able to track your ship and take you out with the first or second shot.
//july15-after researching data storage and building mock protos, sucessfully added highscorelist with data saved on local storage to game
//It seems the data is lost if you close the browser between games?
//July16-opening another sketch using the same name to store data will contaminate savedData on local!  storeItem("hScoresAsteroid", highScoreData); is now used instead of storeItem("hScores", highScoreData) because the sketch savedData already uses 'hScores' on this computer.
//July17-data is still lost after browser is closed?Yes,when I cleared the browser cookies and history, the save info is gone.I would need user to download file to computer from browser to make it more permanent..or?
//loading and saving Json file from browser library could work..
//july26-added saucer class, keypress N creates a new saucer
//saucer still needs bullets with collision against asteroids and ship. saucer needs collision against both ship and asteroids
//july27-asteroids and ship now collide with saucer.
//july30-added original saucer sounds big and small to spawn section under keypress N. soundEffect is paused during gameplay section when saucer dies.
//Remember that after 10,000 points, the small saucers appear and are worth 1000 points apiece
//july31-added timed saucer calls inside playBeat() function
//slowing down the heart beat without hearing skips is proving a challenge.
//sound still gets choppy when score > 10000
//Aug17-had to move-recommencing after break
//added a persistant sound radio button to give user option to kill the sound at any time during playtesting. Turns out, there is no game lag past 10,000 points when sound is off.so Sound structuring needs improvements.
//Aug19-added a delay when respawning asteroids after clearing.
//look at end of inGamefunc() for implemantation. inGameFunc() is continous loop, so when asteroids < 1, start adding+1 to empty var spawnTimer. If timer > 160, execute spawning, reset timer.
//else, play beatSound(); Using if/esle here, will ensure beat stops momentarily before asteroids are respawned on screen adding to the effect like holding your breath, before the beat resumes.
//Sept 13-known issues.
//sound still gets choppy after 6000-10000 points? memory leak?
//small saucer still needs precision aim
//smooth speed increase of alternating sound beat is still missing.
//it works! custum soundFX class solves the longplay sound lag issue. Avoid using P5.sound! buggy! thankx to Geometric Sounds v2 copy by rjgilmour for providing a solution!
//https://www.reddit.com/r/p5js/comments/opo5h3/sound_starts_to_get_distorted_after_a_while/
//Sept22-added a speedup to bg soundeffect,using frameModNum
// !hear a noticable hiccup during PlayBeat().
//Sept24-changed speedup system to utilize ps.part using setBPM()
//to smoothly speed up soundeffect without hiccups!However, longplay lag issue has returned. look at building another custum class?.
//Sept27-built a custom class based on previous model class SFX2
// discovered lag is ocurring with thrust sfx also.
//oct8-sound beats cut out at 6000 pts. thrust gone also.
//fire sounds and explosions still work.
//added another loop pause when asteroids are zero
 //line 632  beatSound.myPart.noLoop(); is Lag still there?
//Oct 28 -played to over 12,000 with no lag! 
//Jan13-playtest reveealed major lag starting around 10,000 points. internet? try again later

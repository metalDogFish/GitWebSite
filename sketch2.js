//Slime Molds- changing the sensor angle results in wild variations..
//----------------------------------------s.nykwist

let molds = [];
let num = 4000;
let d;
let slider;
let btnUp, btnDn;
//let isPaused = false;

function setup() {
  createCanvas(400, 400);

  //referenced by mold
  angleMode(DEGREES);
  d = pixelDensity();

  //create an array of mold
  for (let i = 0; i < num; i++) {
    molds[i] = new Mold();
  }

  //set up user interface--------------
  slider = createSlider(0, 360, 45, 5);
  //slider.value = 45;
  slider.mouseClicked(sliderFunc);
  btnUp = createButton(" + ");
  btnUp.mouseClicked(butFuncUp);
  btnDn = createButton(" - ");
  btnDn.mouseClicked(butFuncDn);
  //-------------------end interface
}

function draw() {
  //important that background is set to black, alpha = 5;
  background(0, 5);

  //needed to detect pixel color
  loadPixels();

  //move and display molds
  for (let i = 0; i < num; i++) {
    //trigger to stop mold growth
    if (key == "s") {
      // If "s" key is pressed, molds stop moving
      molds[i].stop = true;
      updatePixels();
      noLoop();
      print("frozen");
    }

    molds[i].update();
    molds[i].display();
  }
}

function butFuncUp() {
  // slider.value += 5;
  //slider.setValue(5);
  //get original slider value
  let sv = slider.value();
  //try to set slider adding 5 to value
  slider.value(sv + 5);
  //call slider func that changes mold
  sliderFunc();

  print("increasing to " + (sv + 5));
}

function butFuncDn() {
  //get original slider value
  let sv = slider.value();
  //try to set slider adding 5 to value
  slider.value(sv - 5);
  //call slider func that changes mold
  sliderFunc();

  print("decreasing to " + (sv - 5));
}

function sliderFunc() {
  let sv = slider.value();
  console.log("slider reset " + sv);
  for (let m of molds) {
    //parameter takes slider value
    m.resetValue(sv);
  }
}

//2024/11/23-discovering slime molds-
//testing code has revealing some interesting phenomena happing in the patterns when sensorAngle is changed.
//resetAngles 0-produces straight lines,
//5 produces a blurry curling pattern,
//45 produces a well-defined web like pattern
//90 produces a thicker faint chain-link fence pattern
//110 patterns begin to break down to form symbols, roadways & paths!
//135-produces tight cheerio circles(low action scene)
//180 tight circles are replaced by swirling atom like structures.
//increased activity resembling battling ant colonies.
//230->and up looks like energetic white quantum foam.(high action)
//360 gives no restriction of angle, so we get straight lines just like angle 0


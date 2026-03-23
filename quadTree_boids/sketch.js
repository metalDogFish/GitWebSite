//A study in flocking behavior utilizing a quadtree for improved efficiency.
//using 200 maxBoids, framerate still slows to 20; quadtree yet to be implemented!
//using 1000 boids at 30-60f/s! noticable difference in speed using quadtree.

let boids = [];
let qtree;
let boundary;
let myRadio;
let isFlocking = false;
let capacity = 2;
let pointNum = 1000;
//needs to be global
var perceptionRadius = 14;

function setup() {
  createCanvas(500, 500);
  background(22);
  frameRate(60);

  boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);

  qtree = new QuadTree(boundary, capacity);

  //add this many points
  for (let i = 0; i < pointNum; i++) {
    //lets try randomGaussian spread
    let pg = new Point(
      randomGaussian(width / 2, width / 8),
      randomGaussian(height / 2, height / 8)
    );

    boids[i] = new Boid(pg.x, pg.y);
    //qtree.insert(boids[i].position);
    qtree.insert(pg);
  }

  myRadio = createRadio();
  myRadio.size = 60;
  //REMEMBER, the radio parameters are both strings!
  myRadio.option(true, "flocking");
  myRadio.option("false", "random heading");
  myRadio.mouseClicked(clickFunc);
  myRadio.selected("false");

  console.log(myRadio.value());
}

function draw() {
  background(22);

  //clear qtree or make new tree
  qtree.clearQuadTree();
  qtree = new QuadTree(boundary, 2);//faster than clear())?

  //important to have 2 loops, points need to be all entered before 2nd loop can query them.
  for (let i = 0; i < boids.length; i++) {
    let p = new Point(boids[i].position.x, boids[i].position.y, boids[i]);
    //insert point into quadtree with reference to boid
    qtree.insert(p);
    //do this here in first loop
    boids[i].update2();
    boids[i].render();
  }
  //second loop for query()
  // for (let b of boids) {
  for (let i = 0; i < boids.length; i++) {
    if (isFlocking) {
      let range = new Circle(
        boids[i].position.x,
        boids[i].position.y,
        perceptionRadius
      );

      //find neighbors using quadtree
      // let neighbors = [];
      // qtree.query(range, neighbors);
      let ne = qtree.query(range);
      //if at least one neighbor exists,
      if (ne[0]) {
        boids[i].flock(ne);
        // print("flock" + neighbors[0].x + ":" + neighbors[0].y);
      }
      //print("flock "+neighbors[0].position);
    }
  }
 
  //show new tree
  qtree.show();

 // print(frameRate()); // + " velocity: "+boids[0].velocity);
}

let txt = "";
function myFunction(value, index, array) {
  txt += value + "<br>";
}

function clickFunc() {
  let val = myRadio.value();

  //set bool which affects draw()
  if (val === "true") {
    isFlocking = true;
  } else if (val === "false") {
    isFlocking = false;
    //also give every boid a random direction
    for (let b of boids) {
      //change velocity AND acceleration
      b.resetRandomVel();
    }
  }
  console.log("isFlocking " + val + ":" + isFlocking);
}
/*
function clickFunc() {
  let value = myChoice.value();

  console.log("clickfunc" + value);
  //clear boid array
  boids = [];
  //add this many points
  for (let i = 0; i < 100; i++) {
    //lets try randomGaussian spread
    let pg = new Point(
      randomGaussian(width / 2, width / 8),
      randomGaussian(height / 2, height / 8)
    );

    //init boids
    boids[i] = new Boid(pg.x, pg.y);
    //change boid speed
    // boids[i].maxspeed = int(myChoice.value());
    //boids[i].setSpeed(value, boids[i]);
    boids[i].setSpeed(value);
    //add to qtree
    qtree.insert(boids[i].position);
  }
}
*///--------flocking algorythm using quadtree for efficient execution.----------
//2024/11/30 discovered spawning over 400 boids causes lag when flocking is on.
//need to utilize quadtree inside flocking behavior-target goal 1000 boids.
//12-09 restructured code after discovering more code examples online.
//using 200 maxBoids, framerate still slows to 20; quadtree yet to be implemented!
//switched to using p5.min and speed tripled back up to 60f/s!
//using 500 Boids, framerate slows to 30f/s
//12-12 Ok quadtree sucessfully implemented in each 3 flocking algorythms!separation(),cohesion() and Align()
//using 1000 boids at 30-60f/s! noticable difference in speed.

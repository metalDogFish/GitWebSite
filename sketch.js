// Flowfields with persistant particles.
//flowfields are created using Perlin noise mapped to a 2d grid.
//z dimension toggle allows flowfield to move through time.
//curtain toggle hides background grid to focuss on particle movement.
//particles get their directional movement from surrounding flowfield. 
//shawn nykwist

var inc = 0.1;
var scl = 10;
var cols, rows;
var fr;

var zoff = 0;

var particles = [];

var flowfield;
var chBox, chBox2;

function setup() {
 
  let canvas = createCanvas(300, 300);
  //reference container in index.html
  canvas.parent('sketch-container');
 
  cols = floor(width / scl);
  rows = floor(height / scl);

  flowfield = new Array(cols * rows);

  fr = createP("");
  fr.style("font-size", "16px");
  let col = color(255);
  fr.style("color", col);

  for (let i = 0; i < 200; i++) {
    particles[i] = new Particle();
  }

  chBox = createCheckbox("z dimension",true);
  chBox.style("color", col);
  chBox2 = createCheckbox("curtain");
  chBox2.style("color", col);
}

function draw() {
  background(20, 90); //makes particles appear a bit translucent
  // randomSeed(10);
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      //var n = noise(xoff, yoff) * 255;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 2; //higher number induces more vortices.
      var v = p5.Vector.fromAngle(angle);
      v.setMag(0.5);
      flowfield[index] = v;
      xoff += inc;

      if (!chBox2.checked()) {
        //green kelp
        stroke(20, 130, 30, 80);
        push();
        translate(x * scl, y * scl);
        rotate(angle); //v.heading());
        line(0, 0, scl * 1.4, 0);
         pop();
      }
      //fill(random(255));
      //fill(v);
      // rect(x * scl, y * scl, scl, scl);
     
    }
    yoff += inc;
    //Is checkbox1 checked? Say so.
    if (chBox.checked()) {
      text("Flowing", 20, 40);
      zoff += 0.00003;
    }
    // zoff += 0.0003; //z acts like time dimension
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
  //pop();
  //stroke(240);
  // fill(240);
  fr.html(floor(frameRate()));
}

function mouseClicked(){
  let mx = mouseX;
  let my = mouseY;
  
  let p = new Particle(mx,my)
  particles.push(p);
  print('new particle')
}
//https://www.youtube.com/watch?v=BjoM9oKOAKY&list=PLRqwX-V7Uu6bgPNQAdxQZpJuJCjeOr7VD&index=6
//extending this to mimick ocean kelp moving with the currents..

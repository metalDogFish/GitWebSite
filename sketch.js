// Flowfields with persistant particles.
//flowfields are created using Perlin noise mapped to a 2d grid.
//z dimension toggle allows flowfield to move through time.
//curtain toggle hides background grid to focuss on particle movement.
//particles get their directional movement from surrounding flowfield. 
//shawn nykwist

//need to use instance mode when using multiple sketches
let sketch1 = function(p){

 
var inc = 0.1;
var scl = 10;
var cols, rows;
var fr;
var zoff = 0;
var particles = [];
var flowfield;
var chBox, chBox2;
p.setup = function(){
 
  let canvas = p.createCanvas(300, 300);
  //reference container in index.html
  canvas.parent('sketch-container');
 
  cols = p.floor(p.width / scl);
  rows = p.floor(p.height / scl);

  flowfield = new Array(cols * rows);

  fr = p.createP("");
  fr.style("font-size", "16px");
  let col = p.color(255);
  fr.style("color", col);

  for (let i = 0; i < 200; i++) {
   //This ensures your class works correctly within the p5 instance mode and doesn't conflict with other sketches.
    particles[i] = new Particle(p, p.random(p.width),p.random(p.height));
  }

  chBox = p.createCheckbox("z dimension",true);
  chBox.style("color", col);
 chBox.parent('sketch-container');
  chBox2 = p.createCheckbox("curtain",true);
  chBox2.style("color", col);
  chBox2.parent('sketch-container');
}

//function draw() {
 p.draw = function(){
  p.background(20, 90); //makes particles appear a bit translucent
  // randomSeed(10);
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      //var n = noise(xoff, yoff) * 255;
      var angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 2; //higher number induces more vortices.
     // var v = p.Vector.fromAngle(angle);
     var v = p.createVector(1,0);
     v.rotate(angle);
      v.setMag(0.5);
      flowfield[index] = v;
      xoff += inc;

      if (!chBox2.checked()) {
        //green kelp
        p.stroke(20, 130, 30, 80);
        p.push();
        p.translate(x * scl, y * scl);
        p.rotate(angle); //v.heading());
        p.line(0, 0, scl * 1.4, 0);
         p.pop();
      }
      //fill(random(255));
      //fill(v);
      // rect(x * scl, y * scl, scl, scl);
     
    }
    yoff += inc;
    //Is checkbox1 checked? Say so.
    if (chBox.checked()) {
      p.text("Flowing", 20, 40);
      zoff += 0.00003;
    }
    // zoff += 0.0003; //z acts like time dimension
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield,scl,cols);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
  //pop();
  //stroke(240);
  // fill(240);
  fr.html(p.floor(p.frameRate()));
}

//function mouseClicked(){
 p.mousePressed = function(){
  let mx = p.mouseX;
  let my = p.mouseY;
  
  let nup = new Particle(p,mx,my)
  particles.push(nup);
  p.print('new particle')
}
};

new p5(sketch1);
//https://www.youtube.com/watch?v=BjoM9oKOAKY&list=PLRqwX-V7Uu6bgPNQAdxQZpJuJCjeOr7VD&index=6
//extending this to mimick ocean kelp moving with the currents..

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
 
  cols = this.p.floor(width / scl);
  rows = this.p.floor(height / scl);

  flowfield = new Array(cols * rows);

  fr = this.p.createP("");
  fr.style("font-size", "16px");
  let col = this.p.color(255);
  fr.style("color", col);

  for (let i = 0; i < 200; i++) {
   //This ensures your class works correctly within the p5 instance mode and doesn't conflict with other sketches.
    particles[i] = new Particle(p, p.random(p.width),p.random(p.height)));
  }

  chBox = this.p.createCheckbox("z dimension",true);
  chBox.style("color", col);
 chBox.parent('sketch-container');
  chBox2 = this.p.createCheckbox("curtain",true);
  chBox2.style("color", col);
  chBox2.parent('sketch-container');
}

//function draw() {
 p.draw = function(){
  this.p.background(20, 90); //makes particles appear a bit translucent
  // randomSeed(10);
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      //var n = noise(xoff, yoff) * 255;
      var angle = this.p.noise(xoff, yoff, zoff) * this.p.TWO_PI * 2; //higher number induces more vortices.
      var v = this.p.p5.Vector.fromAngle(angle);
      v.setMag(0.5);
      flowfield[index] = v;
      xoff += inc;

      if (!chBox2.checked()) {
        //green kelp
        this.p.stroke(20, 130, 30, 80);
        this.p.push();
        this.p.translate(x * scl, y * scl);
        this.p.rotate(angle); //v.heading());
        this.p.line(0, 0, scl * 1.4, 0);
         this.p.pop();
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
  fr.html(this.p.floor(this.p.frameRate()));
}

function mouseClicked(){
  let mx = this.p.mouseX;
  let my = this.p.mouseY;
  
  let p = new Particle(p,mx,my)
  particles.push(p);
  this.p.print('new particle')
}
};

new p5(sketch1);
//https://www.youtube.com/watch?v=BjoM9oKOAKY&list=PLRqwX-V7Uu6bgPNQAdxQZpJuJCjeOr7VD&index=6
//extending this to mimick ocean kelp moving with the currents..

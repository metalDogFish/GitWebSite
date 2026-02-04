
class Particle {
 // constructor(p, defX = random(width),defY = random(height)) {
  constructor(p, defX, defY){
    this.p = p;
    this.pos = this.p.createVector(defX, defY);
    this.vel = this.p.createVector(0, 0);//p5.Vector.random2D();
    this.acc = this.p.createVector(0, 0);
    this.maxspeed = 4;
    this.prevPos = this.pos.copy();
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  follow(vectors,scl,cols) {
    var x = this.p.floor(this.pos.x / scl);
    var y = this.p.floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
   if(force){
     this.applyForce(force);
   }
  }

  applyForce(force) {
   if(force){
    this.acc.add(force);
   }
  }

  show() {
    //stroke(255, 10);
    this.p.stroke(75,190,200);
    this.p.strokeWeight(4);
  this.p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > this.p.width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = this.p.width;
      this.updatePrev();
    }
    if (this.pos.y > this.p.height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = this.p.height;
      this.updatePrev();
    }

  }

}

// Daniel Shiffman
// http://patreon.com/codingtrain


//20,50,100 -asteroid points
class Asteroid {
  constructor(x, y, type, r) {
    //this.x = x;
    //this.y = y;
    if (r) {
      this.r = r * 0.5;
    } else {
      this.r = random(25, 50);
    }
    this.isHit = false;
    //use vector instead for access to math libraries
    this.position = createVector(x, y);
    this.heading = 0; //directon pointing-used for spin
    this.velocity = p5.Vector.random2D(); //handy lib func

    this.w = random(20, 40);
    this.h = random(30, 60);
    //this.r = random(15, 50);
    this.total = random(8, 20); //vertices
    this.spin = random(-0.03, 0.03); //spin is applied to heading every frame
    this.type = type; //square, circle or polygon verts[]
    this.verts = [];
    this.offset = [];
    for (var i = 0; i < this.total; i++) {
      this.offset[i] = random(-this.r * 0.3, this.r * 0.3); // random(-8, 8);
    }
    //------------------------------------------
    if (this.type == "square") {
      //verts used for collision detection
      let leftCorner = createVector(
        this.position.x - this.w / 2,
        this.position.y - this.h / 2
      );
      let rightCorner = createVector(
        this.position.x + this.w / 2,
        this.position.y - this.h / 2
      );
      let leftCBottom = createVector(
        this.position.x - this.w / 2,
        this.position.y + this.h / 2
      );
      let rightCBottom = createVector(
        this.position.x + this.w / 2,
        this.position.y + this.h / 2
      );
      this.verts = [leftCorner, rightCorner, leftCBottom, rightCBottom];
    }
    //------------------------
    if (this.type == "circle") {
      this.radius = random(20, 40);
    }
    if (this.type == "vertex") {
      //use 10 vertices
      for (var j = 0; j < this.total; j++) {
        var angle = map(j, 0, this.total, 0, TWO_PI);
        var xx = this.r * cos(angle);
        var yy = this.r * sin(angle);
        //push into vertex array
        this.verts.push(vertex(xx, yy));
      }
    }

    print("asteriod born " + this.type); // + this.verts[1]);
    //glow effect
    // drawingContext.shadowBlur = 20; //10;
    // drawingContext.shadowColor = "white";
  }

  drawAst(colr = 250) {
    push();
    //glow effect
    // drawingContext.shadowBlur = 30; //10;//light effect
    // drawingContext.shadowColor = "white";

    if (this.isHit) {
      fill("white");
      //this.isHit = false;
      //just color here,check collisionDetection for trigger
    } else {
      noFill();
    }
    stroke(colr);
    //translate to each position before rotating
    translate(this.position.x, this.position.y);

    //do the rotate math here
    this.heading += this.spin;
    if (this.heading > 360) {
      this.heading -= 360;
    } else if (this.heading < -360) {
      this.heading += 360;
    }
    rotate(this.heading);

    // rect(this.position.x, this.position.y, this.w, this.h);
    if (this.type == "square") {
      rect(0, 0, this.w, this.h);
    } else if (this.type == "circle") {
      circle(0, 0, this.radius);
    } else if (this.type == "vertex") {
      //vertices loaded in constructor
      let glowColor = "white";
      glow(glowColor, 400);
      beginShape();
      for (var i = 0; i < this.total; i++) {
        var angleP = map(i, 0, this.total, 0, TWO_PI);
        var r = this.r + this.offset[i];
        var xx = r * cos(angleP);
        var yy = r * sin(angleP);
        //push into vertex array
        //this.vertices.push(vertex(xx,yy));
        var v = vertex(xx, yy);
        //  print("vertex " + v);
      }
      endShape(CLOSE);
      /*
      beginShape();
      for (var i = 0; i < this.total; i++) {
        var angleP = map(i, 0, this.total, 0, TWO_PI);
        var r = this.r + this.offset[i];
        var xx = r * cos(angleP);
        var yy = r * sin(angleP);
        //push into vertex array
        //this.vertices.push(vertex(xx,yy));
        var v = vertex(xx, yy);
        //  print("vertex " + v);
      }
      endShape(CLOSE);
       glow(glowColor, 80);
       beginShape();
      for (var i = 0; i < this.total; i++) {
        var angleP = map(i, 0, this.total, 0, TWO_PI);
        var r = this.r + this.offset[i];
        var xx = r * cos(angleP);
        var yy = r * sin(angleP);
        //push into vertex array
        //this.vertices.push(vertex(xx,yy));
        var v = vertex(xx, yy);
        //  print("vertex " + v);
      }
      endShape(CLOSE);
      
      beginShape();
      for (var i = 0; i < this.total; i++) {
        var angleP = map(i, 0, this.total, 0, TWO_PI);
        var r = this.r + this.offset[i];
        var xx = r * cos(angleP);
        var yy = r * sin(angleP);
        //push into vertex array
        //this.vertices.push(vertex(xx,yy));
        var v = vertex(xx, yy);
        //  print("vertex " + v);
      }
      endShape(CLOSE);
      glow(glowColor, 12);
         beginShape();
      for (var i = 0; i < this.total; i++) {
        var angleP = map(i, 0, this.total, 0, TWO_PI);
        var r = this.r + this.offset[i];
        var xx = r * cos(angleP);
        var yy = r * sin(angleP);
        //push into vertex array
        //this.vertices.push(vertex(xx,yy));
        var v = vertex(xx, yy);
        //  print("vertex " + v);
      }
      endShape(CLOSE);
      */
      beginShape();
      for (var i = 0; i < this.total; i++) {
        var angleP = map(i, 0, this.total, 0, TWO_PI);
        var r = this.r + this.offset[i];
        var xx = r * cos(angleP);
        var yy = r * sin(angleP);
        //push into vertex array
        //this.vertices.push(vertex(xx,yy));
        var v = vertex(xx, yy);
        //  print("vertex " + v);
      }
      endShape(CLOSE);
    }
    pop();
  }

  //--------------------------------------------------
  update() {
    // let vel = this.velocity;
    // vel.mult(2);
    this.position.add(this.velocity);
    this.edges();

    //also update vertices for collision detection after movement
    //if square asteroid------------
    let leftCorner = createVector(
      this.position.x - this.w / 2,
      this.position.y - this.h / 2
    );
    let rightCorner = createVector(
      this.position.x + this.w / 2,
      this.position.y - this.h / 2
    );
    let leftCBottom = createVector(
      this.position.x - this.w / 2,
      this.position.y + this.h / 2
    );
    let rightCBottom = createVector(
      this.position.x + this.w / 2,
      this.position.y + this.h / 2
    );
    if (this.type == "square") {
      this.verts = [leftCorner, rightCorner, leftCBottom, rightCBottom];
    }
    //add CD to asteriod instead of ship to avoid cycling through asteroid array every frame.
    //asteroids check for ship every frame, trigger ship toggle isHit
    if (ship.isBlinking == false) {
      this.collisionDetection(ship);
    }
    if (saucer.active) {
      this.collisionDetection(saucer);
    }
  }

  addScore() {
    //figure our score based on radius and adjust global score var
    if (this.r > 30) {
      score += 20;
    } else if (this.r > 15) {
      score += 50;
    } else {
      score += 100;
    }
  }

  breakup() {
    var newA = [];
    newA[0] = new Asteroid(this.position.x, this.position.y, "vertex", this.r);
    newA[1] = new Asteroid(this.position.x, this.position.y, "vertex", this.r);
    return newA;
  }

  collisionDetection(s) {
    var impactSpot = s.pos.copy();
    var d = dist(this.position.x, this.position.y, impactSpot.x, impactSpot.y);
    if (d < this.r + s.r / 2) {
      if (s == ship) {
        if (ship.mode == "solid" && ship.isBlinking == false) {
          ship.isHit = true; //does s work?
          this.isHit = true; //trigger impact
           resetSoundMod();//slow down soundbackgroundtimer
          //myPart.stop();
          print("hit ship " + impactSpot);
        } else {
          print("ghost");
        }
      }else if(s == saucer){
        if(saucer.active){
         // saucer.isHit = true;
          saucer.active = false;
          this.isHit = true;
          print("hit saucer");
        }
      }
    }
  }

  edges() {
    //screen warps to other side-like asteriods
    if (this.position.x < 0) {
      this.position.x = width;
    } else if (this.position.x > width) {
      this.position.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = height;
    } else if (this.position.y > height) {
      this.position.y = 0;
    }
  }
}

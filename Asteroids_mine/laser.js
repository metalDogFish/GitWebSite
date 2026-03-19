// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/hacZU523FyM

function Laser(spos, angle, team) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(5);
  this.targetVerts = polyVertices; //found in sketch
  //this.astVerts = asteroids;
  //this.targetLines = linesArr;
  this.deathSpot = createVector(0, 0);
  this.targets = [];
  this.targets = targets;
  this.life = 98;
  this.r = 2;
  this.team = team;
  print(this.vel + " vel laser");

  this.update = function () {
    this.pos.add(this.vel);

    this.edges();
    //reduce life
    this.life--;

    //add collision checks
    //let pp = polyPoint(this.targetVerts, this.pos.x, this.pos.y);

    //asteroids hittest use distance
    if (asteroids.length > 0) {
      for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i].type == "vertex") {
          //use radius with circlular asteroids
          var dis = dist(
            this.pos.x,
            this.pos.y,
            asteroids[i].position.x,
            asteroids[i].position.y
          );
          //if distance is less than radii
          if (dis < this.r + asteroids[i].r) {
            print("asteroid laser hit");
            //position offscreen to trigger auto-delete inside sketch
            this.offScreen = true; //called from sketch
            //kill velocity
            this.vel.mult(0);
            //make asteroid flash
            asteroids[i].isHit = true;
            //add explosions here
            // let ds = new explosion(this.pos);
            //push into global array from tracking
            //  explosions.push(ds);
            //swap new asteroids before removing old

            this.pos.x = -width;
            this.pos.y = -height;
          }
        } else if (asteroids[i].type == "square") {
          //used line checks with square asteroids
          let ap = polyPoint(asteroids[i].verts, this.pos.x, this.pos.y);
          //if hit
          if (ap) {
            print("asteroid laser hit");
            //position offscreen to trigger auto-delete inside sketch
            this.offScreen = true; //called from sketch
            this.vel.mult(0);
            //make asteroid flash
            asteroids[i].isHit = true;
            //add explosions here too
            // let ds = new explosion(this.pos);
            //push into global array from tracking
            // explosions.push(ds);
            //this.deathSpot = createVector(this.pos.x, this.pos.y);
            this.pos.x = -width;
            this.pos.y = -height;
          }
        }
      }
    } //----------------end of asteroid cycle

    //check for contact with ship or saucer
    //if fired from player
    if (this.team == "player" && saucer.active) {
      var dis = dist(this.pos.x, this.pos.y, saucer.pos.x, saucer.pos.y);
      if (dis < saucer.r) {
        //hit
        //hide bullet
        this.offScreen = true;
        // saucer.isHit = true;
        //dissapears, no anim
        saucer.active = false;
        //add explosion sound
        let ex = new Explosion(saucer.pos);
        let ex2 = new Explosion(saucer.pos);
        //push into global array from tracking
        explosions.push(ex);
        explosions.push(ex2); //twice the effects
        //hit sound effect
        if (isSoundOn) {
          playBangFX();
        }
        //add score for large saucer kill
        score += 200;
      }
    } else if (this.team == "ai" && !ship.isHit) {
      var dis = dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y);
      if (dis < ship.r) {
        //hit
        this.offScreen = true;
        //add explosion sound
        let ex = new Explosion(ship.pos);
        //push into global array from tracking
        explosions.push(ex);
        //hit sound effect
        // bang1.play();
        if (isSoundOn) {
          playBangFX();
           resetSoundMod();
        }

        //trigger explod anim
        ship.isHit = true;
      }
    }

    /*
    if (pp) {
      print("laser hit");
      //position offscreen to trigger auto-delete inside sketch
      this.offScreen = true; //called from sketch
      this.vel.mult(0);
      //make polygon flash
      polyHit = true; //polyhit found in sketch
      //this.deathSpot = createVector(this.pos.x, this.pos.y);
      this.pos.x = -width;
      this.pos.y = -height;
    }
    */
    if (this.life < 0) {
      // this.offscreen = true;
      this.expired = true;
      //this.vel.multi(0);
      this.pos.x = -width;
      this.pos.y = -height;
    }
  };

  this.render = function () {
    if (this.life > 0) {
      push();
      //drawingContext.shadowBlur = 30; //6; //10;
      //drawingContext.shadowColor = "white";

      stroke(255);
      strokeWeight(4);
      // point(this.pos.x, this.pos.y);
      var glowColor = "white"; //color(332, 58, 91, 100);
      // function textNeon(glowColor) {
      glow(glowColor, 600);
      point(this.pos.x, this.pos.y);
      point(this.pos.x, this.pos.y);
      glow(glowColor, 400);
      point(this.pos.x, this.pos.y);
      point(this.pos.x, this.pos.y);
      glow(glowColor, 200);
      point(this.pos.x, this.pos.y);
      point(this.pos.x, this.pos.y);
      glow(glowColor, 60);
      point(this.pos.x, this.pos.y);
      point(this.pos.x, this.pos.y);
      glow(glowColor, 12);
      point(this.pos.x, this.pos.y);
      point(this.pos.x, this.pos.y);
      pop();
    }
  };

  this.hits = function (asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.r) {
      return true;
    } else {
      return false;
    }
  };

  /*
  this.offscreen = function () {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  };
*/
  this.edges = function () {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  };

  this.lifeCheck = function () {
    if (this.life < 0) {
      return false;
    } else {
      return true;
    }
  };

  // LINE/POINT
  function linePoint(x1, y1, x2, y2, px, py) {
    // get distance from the point to the two ends of the line
    let d1 = dist(px, py, x1, y1);
    let d2 = dist(px, py, x2, y2);

    // get the length of the line
    let lineLen = dist(x1, y1, x2, y2);

    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    let buffer = 0.1; // higher # = less accurate

    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
      return true;
    }
    return false;
  }
  /*
  //multi target (point) check
  function multiTargets(points, px,py){
    for(let i = targets.length-1; i >= 0; i--){
      let pC = pointCircle(points[i].x,points[i].y,this.pos.x,                                  this.pos.y,points[i].size);
    }
    
  }
  */
  // POINT/CIRCLE
  function pointCircle(px, py, cx, cy, r) {
    // get distance between the point and circle's center
    // using the Pythagorean Theorem
    let distX = px - cx;
    let distY = py - cy;
    let distance = sqrt(distX * distX + distY * distY);

    // if the distance is less than the circle's
    // radius the point is inside!
    if (distance <= r) {
      return true;
    }
    return false;
  }

  // POLYGON/POINT
  function polyPoint(vertices, px, py) {
    let collision = false;

    // go through each of the vertices, plus
    // the next vertex in the list
    let next = 0;
    for (let current = 0; current < vertices.length; current++) {
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current + 1;
      if (next == vertices.length) next = 0;

      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      let vc = vertices[current]; // c for "current"
      let vn = vertices[next]; // n for "next"

      // compare position, flip 'collision' variable
      // back and forth
      if (
        ((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
        px < ((vn.x - vc.x) * (py - vc.y)) / (vn.y - vc.y) + vc.x
      ) {
        collision = !collision;
      }
    }
    return collision;
  }
}

class Explosion {
  constructor(vec) {
    this.pos = createVector(vec.x, vec.y);
    this.life = 20 * 1;
    this.particles = [int(random(2, 6))];
    //give random amount for now, maybe have 2 for small,3 for mid, 4 for big?

    for (let i = 0; i < 4; i++) {
      let p = new Particle(this.pos.x, this.pos.y);
      this.particles[i] = p;
      //this.particles[i] = p5.Vector.random2D().mult(2);
      // particle creates own random 2d vector in constructor
    }
    print("explode");
    for (var j = 0; j < this.particles.length; j++) {
      print("particle " + j + this.particles[j]);
    }
  }

  render() {
    this.life--;
    if (this.life < 0) {
      //delete self
      //this.remove();//spliced out of array in sketch.js
    } else {
      push();
      circle(this.pos.x, this.pos.y, this.life);
      //points not showing?
      for (let j = 0; j < this.particles.length; j++) {
        //  point(this.particles[j].pos.x, this.particles[j].pos.y);
        this.particles[j].update();
        this.particles[j].show();
      }
      pop();
    }
  }
}

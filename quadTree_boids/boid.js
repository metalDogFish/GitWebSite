// Boid class
// Methods for Separation, Cohesion, Alignment
class Boid {
  constructor(posX, posY) {
    this.position = createVector(posX, posY);
    this.acceleration = createVector(0, 0);
    //direction
    this.velocity = p5.Vector.random2D();
    //createVector(random(-1, 1), random(-1, 1)); //
    //this.velocity.setMag(random(2, 4));
    this.r = 1.2;
    this.maxforce = 0.05; //steering force
    this.maxspeed = 4; //3
    this.col = color(127, 127, 0);
    //print("born ");
  }
  /*
  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }
*/
  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  update2() {
    //this.edges();
    this.borders();
    this.velocity.add(this.acceleration);
    // Limit speed
    //this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  /*
  align(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighbordist) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
*/

  //this alignment will utilize a quadtree and a set distance
  //instead of cycling through all boids, we use an array of selected neighbors.
  align2(boyds) {
    let steering = createVector(0, 0);
    let total = 0;
    for (let i = 0; i < boyds.length; i++) {
      let d = dist(this.position.x, this.position.y, boyds[i].x, boyds[i].y);
      if (boyds[i] != this && d < perceptionRadius) {
        steering.add(boyds[i].userdata.velocity);
        total += 1;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxspeed);
      steering.sub(this.velocity);
      steering.limit(this.maxforce);
    }

    //this.acceleration = steering;
    return steering;
  }

  applyColor(c) {
    if (c != null) this.col = c;
  }

  // Wraparound
  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  /*
  cohesion(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighbordist) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return createVector(0, 0);
    }
  }
*/
  cohesion2(boyds) {
    // print('cohesion '+boyds[0].userdata.position);
    let steering = createVector();
    let total = 0;

    for (let i = 0; i < boyds.length; i++) {
      //let di = p5.Vector.dist(this.position.x, boids[i].position);
      let di = dist(this.position.x, this.position.y, boyds[i].x, boyds[i].y);
      if (boyds[i] != this && di < perceptionRadius) {
        steering.add(boyds[i].userdata.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxspeed);
      steering.sub(this.velocity);
      steering.limit(this.maxforce);
    }
    return steering;
    //this.acceleration = steering;
  }

  // We accumulate a new acceleration each time based on three rules
  
  flock(boids) {
    let sep = this.separate2(boids, 25.0); // Separation
    let ali = this.align2(boids); // Alignment
    let coh = this.cohesion2(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  flock2(boyds) {
     let alignment = this.align2(boyds);
     let cohesion = this.cohesion2(boyds);
    let separate = this.separate2(boyds);
    // Arbitrarily weight these forces
    //separate.mult(10.5);
    // ali.mult(1.0);
    // cohesion.mult(0.2);
     this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
    this.acceleration.add(separate);
  }
  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  render() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + radians(90);
    fill(this.col);
    stroke(200);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2); //nose
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  separate2(boyds) {
    let steering = createVector();
    let total = 0;

    for (let i = 0; i < boyds.length; i++) {
      let di = dist(
        this.position.x,
        this.position.y,
        boyds[i].userdata.position.x,
        boyds[i].userdata.position.y
      );
      //if (boyds[i] != this && di < perceptionRadius) {
      if (di > 0 && di < perceptionRadius) {
        let neighborVec = p5.Vector.sub(
          this.position,
          boyds[i].userdata.position
        );
        //assign force based on distance
        // neighborVec.div(di * di);//dividing by zero
        neighborVec.normalize();
        neighborVec.div(di); // Weight by distance
        steering.add(neighborVec);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
  
    }
     // As long as the vector is greater than 0
    if (steering.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steering.normalize();
      steering.mult(this.maxspeed);
      steering.sub(this.velocity);
      steering.limit(this.maxforce);
    }

    return steering;
  }
  // Separation
  // Method checks for nearby boids and steers away

  separate(boids, ds) {
    let desiredseparation = ds; //25.0;
    let steer = createVector(0, 0);
    let count = 0;

    print("seperate() " + boids[0].position);

    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
      //let d = p5.Vector.dist(this.position,boids[i].position);
      let d = dist(
        this.position.x,
        this.position.y,
        boids[i].position.x,
        boids[i].position.y
      );
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if (d > 0 && d < desiredseparation) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  /*
  setSpeed(sp, self){
    this.maxspeed = sp;
    console.log('setSpeed'+sp);
   // print('setSpeed'+ self.maxspeed);
  }
  */
  setSpeed(sp) {
    this.maxspeed = sp;
    console.log("setSpeed" + sp);
  }

  resetRandomVel() {
    this.acceleration = createVector(0, 0);
    //direction
    this.velocity = p5.Vector.random2D();
    console.log("resetVel");
  }
}

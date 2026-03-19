class Saucer {
  //constructor(x, y,size,direction) {
  constructor() {
    //saucer chooses for itself which side to start on
    let r = random(0, 1);
    if (r < 0.5) {
      this.direction = "left";
      this.pos = createVector(width + 20, random(20, height - 20));
    } else if (r >= 0.5) {
      this.direction = "right";
      this.pos = createVector(-20, random(20, height - 20));
    }

    //this.pos = createVector(x, y);
    //there is a function to change size! call 1 for small saucer
    this.size = 2.0;
    // this.direction = direction;
    this.active = true;
    this.heading = p5.Vector.random2D(); //this will be xaltered after
    this.r = 24; //18;
    this.directionTime = 160; //when saucer shifts y dir
    this.fireTimer = 100; //when saucer fires weapon
    this.ftMax = 100;
    //control x direction on initialization
    if (this.direction == "left") {
      this.heading.x = -0.8;
    } else if (this.direction == "right") {
      this.heading.x = 0.8;
    }
  }

  display() {
    push();
    stroke(250);
    noFill();
    strokeWeight(2);
    // circle(this.pos.x, this.pos.y, this.r);
    let s = this.size;

    beginShape();

    //bottom
    vertex(this.pos.x - 10 * s, this.pos.y);
    vertex(this.pos.x + 10 * s, this.pos.y);
    vertex(this.pos.x + 6 * s, this.pos.y + 4 * s);
    vertex(this.pos.x - 6 * s, this.pos.y + 4 * s);
    vertex(this.pos.x - 10 * s, this.pos.y);
    //middle
    vertex(this.pos.x - 4 * s, this.pos.y - 3 * s);
    vertex(this.pos.x + 4 * s, this.pos.y - 3 * s);
    vertex(this.pos.x + 10 * s, this.pos.y);
    //top
    vertex(this.pos.x + 4 * s, this.pos.y - 3 * s);
    vertex(this.pos.x + 2 * s, this.pos.y - 6 * s);
    vertex(this.pos.x - 2 * s, this.pos.y - 6 * s);
    vertex(this.pos.x - 4 * s, this.pos.y - 3 * s);
    //dont close, just draw every vertici
    endShape();
    pop();
  }

  //so saucer doesn't complety shift directions-it doesn't shift left or right, only on y axis. then dissapears after reaching other side
  update() {
    if (this.active) {
      this.directionTime--;
      this.fireTimer--;
      this.pos.add(this.heading);
      if (this.directionTime < 1) {
        this.heading.y = p5.Vector.random2D().y;
        this.directionTime = 240;
      }
      if (this.fireTimer < 1) {
        print("fire");
        this.launch();
        this.fireTimer = this.ftMax;
      }
      this.edges();

      this.collisionWithPlayer();

      // bigSaucerFx.loop();
    } else {
      // bigSaucerFx.pause();
    }
  }

  //only checks for collision with player ship, asteroid already run their own collision checks against saucer.
  collisionWithPlayer() {
    var impactSpot = ship.pos.copy();
    var d = dist(this.pos.x, this.pos.y, impactSpot.x, impactSpot.y);
    if (d < this.r / 2 + ship.r / 2) {
      if (ship.mode == "solid" && ship.isBlinking == false) {
        ship.isHit = true; //trigger explode anim
        //place explosion
        let ex = new Explosion(ship.pos);
        //push into global array from tracking
        explosions.push(ex);
        //hit sound effect
        // bang1.play();
        if (isSoundOn) {
          playBangFX();
        }
        //assume saucer is large
        score += 200;
        //turns off saucer
        this.active = false;
        print("hit ship " + impactSpot);
      }
    }
  }

  //tweek size
  setSize(num) {
    //set size to number between 1and 2
    //remember to alter this.r used for collision
    this.size = num;
  }

  //wrap ship around Y screen
  edges() {
    //saucer dissapear after one pass
    if (this.pos.x > width + this.r && this.direction == "right") {
      this.active = false;
    } else if (this.pos.x < -this.r && this.direction == "left") {
      this.active = false;
    }
    //only wrap y
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

  launch() {
    //launchProjectile();
    print("ai fire");

    //create new laser and add to array
    //big saucer is random, small saucer tracks player pos
    let randhead;
    if (this.size == 2) {
      //  angleMode(DEGREES);
      randhead = random(360);
    } else {
      // angleMode(RADIANS);//default
      //saucer is small and precise
      let angleBetw = ship.pos.angleBetween(this.pos);
      //find angle between to points
      randhead = degrees(angleBetw);
      print("saucer fire angle " + randhead);
    }

    lasers.push(new Laser(this.pos, -randhead, "ai")); //this.heading));
    //call sfx
    if (isSoundOn) {
      fireSound.play();
    }
  }
}

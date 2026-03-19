function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.r = 12;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.isBoosting = false;
  this.isHit = false;
  this.isBreaking = false;
  this.mode = "solid";
  this.isBlinking = true;
  this.blinkTime = 180;
  this.btMax = 180;
  this.damageArray = []; //contains force vectors that will be used for explosion
  for (let i = 0; i < 3; i++) {
    let v = p5.Vector.random2D();
    this.damageArray.push(v);
  }

  this.boosting = function (b) {
    this.isThrusting = b;
  };

  this.update = function () {
    if (this.isThrusting) {
      this.boost();
    }
    if (this.mode == "solid") {
      this.pos.add(this.vel);
      this.vel.mult(0.99);
    }
  };

  this.boost = function () {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1);
    this.vel.add(force);
  };

  this.breakApart = function () {
    // resetSoundMod();//non trigger?
    this.isBreaking = true;
    //reset soundbgtimer
    // frameModNum = 60;
   
  };

  this.fire = function () {
    // if (this.okToFire) {
    if (this.isBlinking == false) {
      print("fire");
      //create new laser and add to array
      lasers.push(new Laser(this.pos, this.heading, "player"));
      //call sfx
      if (isSoundOn) {
        fireSound.play();
      }
      // beat1.play();
    }
  };

  //collision based on radius distance
  this.hits = function (asteroid) {
    if (this.mode == "solid" && this.isBlinking == false) {
      var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
      if (d < this.r + asteroid.r) {
       // myPart.stop();
        return true;
      } else {
        return false;
      }
    } else {
      //this.mode = ghost
      return false;
    }
  };

  //ship is drawn facing right using radius points!
  this.render = function () {
    var blinkSwitch;
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    //invulnerable while blinking
    if (this.isBlinking) {
      print("blink");
      this.blinkTime--;
      if (this.blinkTime % 10 == 0) {
        print("one");
        stroke(250);
        triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
      } else {
        print("two");
        //draw nothing
        //stroke(5);
      }
      if (this.blinkTime <= 0) {
        this.isBlinking = false; //breaks loop
        this.blinkTime = this.btMax; //done in shipreset?
      }
    } else if (this.isBreaking == false) {
      //--------------if unhit
      if (this.isHit) {
        fill("red");
        this.isBreaking = true;
      } else {
        fill(0);
      }
      //else {
      stroke(255);
      //}//new shape
      beginShape();
      //let vertexArr = [56, 0, -40, -32, -24, -16, -24, 16, -40, 32,56,0];
      let vertexArr = [14, 0, -10, -8, -6, -4, -6, 4, -10, 8, 14, 0];
      for (let i = 0; i < vertexArr.length - 2; i += 2) {
        let v0 = vertex(vertexArr[i], vertexArr[i + 1]);
      }

      endShape(CLOSE);
      // circle(0, 0,this.r);//testing
      // triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
      if (this.isThrusting) {
        fill(250, 70);
        noStroke();
        triangle(-this.r, -this.r / 2, -this.r, this.r / 2, -this.r * 1.5, 0);
      }
    } else if (this.isBreaking) {
      //---------------------------------after hit
      this.mode = "ghost";

      //keep for testing-main debris function will be found in sketch.js
      debrisFunc(this.pos.x, this.pos.y);

      print("breaking apart"); //short lines drifting outward

      if (debrisSpot) {
        debrisSpot.update();
        debrisSpot.render();
      }
    }
    pop();
  };

  //wrap ship around screen
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

  this.resetShip = function () {
    if (extraLives > 0) {
      this.pos = createVector(width / 2, height / 2);
      this.r = 12;
      this.heading = 0;
      this.rotation = 0;
      this.vel = createVector(0, 0);
      this.isBoosting = false;
      this.isHit = false;
      this.isBreaking = false;
      this.mode = "solid";
      this.damageArray = [];
      this.isBlinking = true;
      this.blinkTime = 300;
      this.btMax = 300;
      //found in sketch.js
      isExploding = false;
      //reset soundbgtimer
      //frameModNum = 60;
    } else {
      this.mode = "ghost"; //otherwise asteroids will trigger hit during endGame
      print("game over!!");
      //switch to end page..
      //gameState = "endGame";
      //if high score, juump to enter name
      if (score > lowestHighScore && wonHiScore == false) {
        gameState = GameState.ENTERNAME;
      } else {
        gameState = GameState.ENDGAME;
      }
    }
    extraLives--;
  };

  this.setRotation = function (a) {
    this.rotation = a;
  };

  this.turn = function () {
    this.heading += this.rotation;
  };
}

/*

class Ship {
  constructor(xx = width / 2, yy = height / 2, size = 12) {
  
    this.pos = createVector(xx, yy);
    //this.acceleration = createVector(0,0);
    this.vel = createVector(0, 0);
    //this.vel.mult(5);
    this.size = size;
    this.r = size;
    this.acc = createVector(0, 0);
    this.angle = 0;
    this.rotation = 0;
    this.inMotion = false;
    this.turnSignal = false;
    this.vertices = [4];
    this.fillVertices();
    this.hitP = false;
    this.hitW = false;
    this.isBoosting = false;
    this.boosting = function (b) {
      this.isBoosting = b;
    };

      this.setRotation = function (a) {
      this.rotation = a;
     };

    print("ship ready");
  }

  fire() {
    // if (this.okToFire) {
    print("fire");

    //get angle for determining where explosion goes
    // this.vel = p5.Vector.fromAngle(this.angle);
    // explosions[0].x = this.pos.x + this.vel.x * 100;
    // explosions[0].y = this.pos.y + this.vel.y * 100;
    //reset timer in sketch.js
    // explosionTimer = eTMax;
    lasers.push(new Laser(this.pos, this.angle));
    //this.isFireLock = true;
    // this.okToFire = false;
    // } else {
    //  print("cooldown in effect");
    // }
  }

  //shows extra target lines  when selected
  show() {
    push();
    // noStroke();
    // stroke(25);
    // strokeWeight(1);
    fill(50, 75);

    translate(this.pos.x, this.pos.y);
   // this.angle = this.vel.heading();
    rotate(this.angle);
    stroke(360);
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    
    //if (this.highLight) {
    // stroke(360);
    //image(img, -240, 4);
    // }

    //targeting line
    // if (this.okToFire) {
    // stroke(360);
    // line(this.r, 0, this.r * 3, 0);
    // line(this.r * 3, this.r, this.r * 3, -this.r);
    //  }

    //color collision here
    if (this.hitP || this.hitW) {
      //stroke(100,100,0);
      fill(200, 100, 0);
      //noStroke();
      //print(" hit me");
    }
    
    //quad is built around centerpoint.
    quad(
      -this.size / 2,
      -this.size / 2,
      -this.size / 2,
      this.size / 2,
      this.size / 2,
      this.size / 2,
      this.size / 2,
      -this.size / 2
    );
    
    //headerLine
    line(0, 0, this.r, 0);
    //rect(this.pos.x,this.pos.y,this.size,this.size);
    pop();
    // this.draw();
  }

  boost() {
    var force = p5.Vector.fromAngle(this.angle);
    force.mult(0.1);
    this.vel.add(force);
  }

  update() {
    //this.vel = p5.Vector.fromAngle(this.angle);
    if (this.isBoosting) {
      this.boost();
    }

    this.pos.add(this.vel);
    this.vel.mult(0.95);

    
    if (this.inMotion) {
      if (this.inReverse) {
        this.pos.sub(this.vel);
        this.acc.set(0, 0);
      } else {
        this.pos.add(this.vel);
        this.acc.set(0, 0);
      }
    
    //update vertices and check collision when moving
    this.fillVertices();
    //  this.collisionHandler();
   
    if (this.turnSignal) {
      // if (this.tankSoundB.isPlaying() == false) {
      // this.tankSoundB.play();
      print("tankSoundB");
   
    }
  }

  fillVertices() {
    this.vertices[0] = createVector(
      this.pos.x + this.size / 2,
      this.pos.y - this.size / 2
    );
    this.vertices[1] = createVector(
      this.pos.x + this.size / 2,
      this.pos.y + this.size / 2
    );
    this.vertices[2] = createVector(
      this.pos.x - this.size / 2,
      this.pos.y + this.size / 2
    );
    this.vertices[3] = createVector(
      this.pos.x - this.size / 2,
      this.pos.y - this.size / 2
    );
    // print("fill vertices");// print() slows down gameplay!
  }

  inputHandler() {
    //called every frame
    if (keyIsDown(LEFT_ARROW)) {
      //if (kb.pressing(LEFT_ARROW)) {
      this.angle -= 0.02;
      this.turnSignal = true;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.angle += 0.02;
      this.turnSignal = true;
    } else {
      this.turnSignal = false;
    }
    if (keyIsDown(UP_ARROW)) {
      this.inMotion = true;
    } else {
      this.inMotion = false;
    }
    
    if (keyIsDown(UP_ARROW)) {
      this.inMotion = true;
      this.inReverse = false;
    } else if (keyIsDown(DOWN_ARROW)) {
      this.inMotion = true;
      this.inReverse = true;
    } else {
      this.inMotion = false;
    }
    
    // if (key == " ") {  //problematic
    // ship.fire();
    // console.log("active shots " + lasers.length);
    // }
  }

  setRotation(a) {
    this.rotation = a;
    //this.angle = a;
    print('set rot'+ a);
  }
  
   turn() {
    this.heading += this.rotation;
  }
}
*/

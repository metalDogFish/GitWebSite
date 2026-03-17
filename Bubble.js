class Bubble {
  constructor(x, y, r = 50) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.init();
  }

  changeColor(bright) {
    this.brightness = bright;
  }

  init() {
    this.name = "bob";
    this.brightness = 0;
    this.speed = 1;
    print("born " + this.radius);
  }

  intersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    if (d < this.radius + other.radius) {
      // print(d);//slows down programm!
      //multiple calls per frame-less than 100 on screen!.
      return true;
    } else {
      return false;
    }
  }

  jiggle() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  }

  show() {
    //push();//without this, all screen text is affected-i like it!
    stroke(255);
    strokeWeight(4);
    fill(this.brightness, 125);
    ellipseMode(RADIUS); //important!-when collision detection is off, check here.
    ellipse(this.x, this.y, this.radius * 2); //good 

    //pop();
  }
  rise() {
    if (this.y > -this.radius*2) {
      this.y -= 1;
    }
    else{
      //remove from array
      bubbles.splice(0,1);
    }
  }
}

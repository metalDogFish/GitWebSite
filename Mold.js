class Mold {
  constructor(p) {
    this.p = p;
    // Mold variables
    this.x = this.p.random(this.p.width);
    this.y = this.p.random(this.p.height); 
    // this.x = random(width/2 - 20, width/2 + 20);
    // this.y = random(height/2 - 20, height/2 + 20); 
    this.r = 0.5;
    
    this.heading = this.p.random(360);
    this.vx = this.p.cos(this.heading);
    this.vy = this.p.sin(this.heading);
    this.rotAngle = 45;
    this.stop = false // Boolean variable to stop molds from moving 
    
    // Sensor variables
    this.rSensorPos = this.p.createVector(0, 0);
    this.lSensorPos = this.p.createVector(0, 0);
    this.fSensorPos = this.p.createVector(0, 0);
    this.sensorAngle = 90;//45;
    this.sensorDist = 10;
    
  }
  
  update() {   
    // Using this.stop to control when molds stop moving
    if (this.stop) {
      this.vx = 0;
      this.vy = 0;
    } else {
      this.vx = this.p.cos(this.heading);
      this.vy = this.p.sin(this.heading);
    }
    
    // Using % Modulo expression to wrap around the canvas
    this.x = (this.x + this.vx + this.p.width) % this.p.width;
    this.y = (this.y + this.vy + this.p.height) % this.p.height;
    
    // Get 3 sensor positions based on current position and heading
    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
    this.getSensorPos(this.fSensorPos, this.heading);
  
    // Get indices of the 3 sensor positions and get the color values from those indices
    let index, l, r, f;
    index = 4*(d * this.p.floor(this.rSensorPos.y)) * (d * this.p.width) + 4*(d * this.p.floor(this.rSensorPos.x));
    r = this.p.pixels[index];
    
    index = 4*(d * this.p.floor(this.lSensorPos.y)) * (d * this.p.width) + 4*(d * this.p.floor(this.lSensorPos.x));
    l = this.p.pixels[index];
    
    index = 4*(d * floor(this.fSensorPos.y)) * (d * this.p.width) + 4*(d * floor(this.fSensorPos.x));
    f = this.p.pixels[index];
    
    // Compare values of f, l, and r to determine movement 
    if (f > l && f > r) {
      this.heading += 0;
    } else if (f < l && f < r) {
      if (this.p.random(1) < 0.5) {
        this.heading += this.rotAngle;
      } else {
        this.heading -= this.rotAngle;
      }
    } else if (l > r) {
      this.heading += -this.rotAngle;
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
    
    
  }
  
  display() {
    this.p.noStroke();
    this.p.fill(255);
    this.p.ellipse(this.x, this.y, this.r*2, this.r*2);
    
    // line(this.x, this.y, this.x + this.r*3*this.vx, this.y + this.r*3*this.vy);
    // fill(255, 0, 0);
    // ellipse(this.rSensorPos.x, this.rSensorPos.y, this.r*2, this.r*2);
    // ellipse(this.lSensorPos.x, this.lSensorPos.y, this.r*2, this.r*2);
    // ellipse(this.fSensorPos.x, this.fSensorPos.y, this.r*2, this.r*2);
    
  }
  
  getSensorPos(sensor, angle) {
    sensor.x = (this.x + this.sensorDist*this.p.cos(angle) + this.p.width) % this.p.width;
    sensor.y = (this.y + this.sensorDist*this.p.sin(angle) + this.p.height) % this.p.height;
  }
  
  resetValue(val){
    this.sensorAngle = val;
    this.p.print('reset value '+val);
  }

}

//sources-Connect with Patt: @pattvira
//https://www.pattvira.com/

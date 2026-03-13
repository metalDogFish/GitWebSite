float t = 0;
int rectX, rectY, rectSize;      // Position of square button
int linkX, linkY, linkSize;  //link to url button
boolean rectOver = false;
boolean overLink = false;
color rectColor, rectHighlight;
int page = 0;

void setup() {
  size(500, 500);

  noFill();
  stroke(255);
  strokeWeight(2);
  textAlign(CENTER);
  //box
  rectColor = color(0);
  rectHighlight = color(51);
  // rectMode(CENTER);
  rectSize = 80;
  rectX = width-rectSize-10;
  rectY = height-rectSize/2-10;
  //rect(-50,120,100,30);
  linkX = width/2-50;
  linkY =  height/2+120;
  linkSize = 100;
}

void draw() {

  background(0);
  //----------center screen------------
  translate(width/2, height/2);
  noFill();

  //handles pages 1->?
  screenDisplay();

  //time var used for animations
  t += 0.1;

  // print(mouseX + " :x " + mouseY + " :y "); //10,40 -> 40,10
  //we are using Cartesian coords for UI because of mouse coords
  translate(-width/2, -height/2);
  //back to cartesiam screen----------------

  update(mouseX, mouseY);//check mouse position for bools
  //ui-----
  String word = "";
  if (rectOver) {
    fill(rectHighlight);
    word = "next page";
    //text("next page",rectX,rectY);-gets painted over unless positioned on top of button
  } else {
    fill(rectColor);
  }
  // stroke(255);-doesnt affect text?
  rect(rectX, rectY, rectSize, rectSize/2);
  textSize(16);
  fill(255);//fill affects text in processing
  text(word, rectX+rectSize/2, rectY+24);//24
  if (page == 4) {
    //display link here so mouse can operate in cartesian space
    //color & enable link to url
    if (overLink) {
      fill(rectHighlight);
    } else {
      fill(rectColor);
    }
    rect(linkX, linkY, linkSize, linkSize/3);
    textSize(16);
    fill(255);//fill affects text in processing
    text("wiki link", linkX+linkSize/2, linkY+24);//24
  }
}

//polor coord func
float r(float theta, float a, float b, float m, float n1, float n2, float n3) {
  return pow(pow(abs(cos(m*theta/4.0) /a), n2) +
    pow(abs(sin(m * theta/4.0) / b), n3), -1.0 /n1);
}

void update(int x, int y) {
  if ( overRect(rectX, rectY, rectSize, rectSize/2) ) {
    rectOver = true;
  } else {
    rectOver = false;
  }
  if ( overRect(linkX, linkY, linkSize, linkSize/3)) {
    overLink = true;
  } else {
    overLink = false;
  }
  //print("update:"+x+":"+y);
}

void mousePressed() {
  if (rectOver) {
    print("click button");
    page++;
  } else if (overLink) {
    link("https://en.wikipedia.org/wiki/Superformula");
  }
}

boolean overRect(int x, int y, int width, int heightt) {
  if (mouseX >= x && mouseX <= x+width &&
    mouseY >= y && mouseY <= y+heightt) {
    return true;
  } else {
    return false;
  }
}

//(operating in center space)
boolean flipN = false;
void screenDisplay() {
  if (page == 1) {
    beginShape();

    //add vertices.
    for (float theta = 0; theta <= 2 * PI; theta += 0.01) {
      float rad = r(theta,
        2.0, // mouseX / 100.0, //a -size of shape
        2.0, //mouseY / 100.0, //b
        6, //m //value 0 for circle
        -1.5, //n1
        sin(t)*0.5 +0.5, //n2 -use sin(t) to get animation loops
        cos(t)*0.5 +0.5 //n3
        );
      //convert func
      float x = rad * cos(theta) * 50;
      float y = rad * sin(theta) * 50;
      vertex(x, y);
    }

    endShape();
  } else if (page == 2) {
    beginShape();

    //add vertices.
    for (float theta = 0; theta <= 2 * PI; theta += 0.01) {
      float rad = r(theta,
        4.0, // mouseX / 100.0, //a -size of shape
        4.0, //mouseY / 100.0, //b
        6, //m //value 0 for circle
        2.5, //n1
        sin(t)*0.5 +0.5, //n2 -use sin(t) to get animation loops
        cos(t)*0.5 +0.5 //n3
        );
      //convert func
      float x = rad * cos(theta) * 60;
      float y = rad * sin(theta) * 60;
      vertex(x, y);
    }

    endShape();
    text("more to follow..", 0, 0);
  } else if (page == 3) {
    beginShape();

    //add vertices.
    for (float theta = 0; theta <= 2 * PI; theta += 0.01) {
      float rad = r(theta,
        4.0, // mouseX / 100.0, //a -size of shape
        4.0, //mouseY / 100.0, //b
        6, //m //value 0 for circle
        sin(t)*0.5+0.0, //2.5, //n1
        sin(t)*0.5 +0.5, //n2 -use sin(t) to get animation loops
        cos(t)*0.5 +0.5 //n3
        );
      //convert func
      float x = rad * cos(theta) * 60;
      float y = rad * sin(theta) * 60;
      vertex(x, y);
    }

    endShape();

    text("patience..", 0, 0);
  } else if (page == 4) {
    text("and understanding. thank you..", 0, 0);
  } else {
    //-----start page--------------------------------------
    textSize(22);
    text("SuperFormula for creating shapes", 0, -50);
    line(-110, -40, 110, -40);
    String s = "float r(float theta, float a, float b, float m, float n1, float n2, float n3) ";
    String s2 = "{ return pow(pow(abs(cos(m*theta/4.0) /a), n2) +";
    String s3 = "pow(abs(sin(m * theta/4.0) / b), n3), -1.0 /n1}";
    textSize(14);
    text(s, 0, 30);
    text(s2, 0, 50);
    text(s3, 0, 70);
  }
  //-ability to cycle pages
  if ( page > 4)page = 0;
}

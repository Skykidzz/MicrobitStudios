var font = [];
var img  = [];
var imgs = []; 
var nav  = [];
var page = 0;  
var canW, canH;
var scrollY = 0;
var hoverAlpha = [];
var size = 0;

var navLabels = ["Home", "Photos"];
var NAV_H;  
var GAL_COLS; 

function setup() {
  canW  = windowWidth;
  canH  = windowHeight;
  size = size = 1 - ((1920 - canW) + (861 - canH)) / 2781
  NAV_H = max(60, canW * 0.065);

  font.push(loadFont("PresqueElegante.otf"));

 
  img.push(loadImage("logo.png"));       
  img.push(loadImage("thing.jpeg"));     
  img.push(loadImage("flower1.jpg"));    
  img.push(loadImage("flower2.jpeg"));   
  img.push(loadImage("flower3.jpeg"));  
  img.push(loadImage("flower4.jpeg"));  
  img.push(loadImage("plant1.jpeg"));    
  img.push(loadImage("plant2.jpeg"));   
  img.push(loadImage("macbook.jpeg"));   

  // initialise hover colour per nav item
  for (var i = 0; i < navLabels.length; i++) hoverAlpha.push(0);

  // choose gallery columns based on width
  GAL_COLS = canW >= 1200 ? 4 : canW >= 800 ? 3 : canW >= 500 ? 2 : 1;

  var galRows  = ceil((img.length - 2) / GAL_COLS);
  var galSize  = (canW - 60) / GAL_COLS; // cell size (square)
  var photosH  = NAV_H + 30 + galRows * (galSize + 15) + 80;

  var homeH    = max(canH, NAV_H + 60 + canW * 0.44 + 250 + 480);
  var heights  = [homeH, photosH];

  createCanvas(canW, heights[page]);
  textFont(font[0]);
}

// ── window resize ────────────────────────────────────────────────────────────
function windowResized() {
  canW  = windowWidth;
  canH  = windowHeight;
  NAV_H = max(60, canW * 0.065);
  GAL_COLS = canW >= 1200 ? 4 : canW >= 800 ? 3 : canW >= 500 ? 2 : 1;

  var galSize  = (canW - 60) / GAL_COLS;
  var galRows  = ceil((img.length - 2) / GAL_COLS);
  var photosH  = NAV_H + 30 + galRows * (galSize + 15) + 80;
  var homeH    = max(canH, NAV_H + 60 + canW * 0.44 + 250 + 480);
  var heights  = [homeH, photosH];

  resizeCanvas(canW, heights[page]);
}

// ── draw ─────────────────────────────────────────────────────────────────────
function draw() {
  scrollY = window.pageYOffset || 0;
  background(44, 0, 88);  // deep indigo

  if (page === 0) drawHome();
  else            drawPhotos();

  drawNav();
}

// ── NAV BAR ──────────────────────────────────────────────────────────────────
function drawNav() {
  var fade = window.pageYOffset * size * 8;

  // backdrop
  noStroke();
  fill(20, 0, 50, 200  - fade);
  rect(0, 0, canW, NAV_H);

  // bottom border line
  stroke(180, 0, 255, 80 - fade);
  strokeWeight(1);
  line(0, NAV_H, canW, NAV_H);

  // logo centred — draw with SCREEN blend so the black bg disappears
  var logoH = NAV_H * 0.80;
  var logoW = logoH * (img[0].width / img[0].height);
  var logoX = canW / 2 - logoW / 2;
  var logoY = NAV_H / 2 - logoH / 2;
  tint(255, 255  - fade);
  blendMode(SCREEN);
  image(img[0], logoX, logoY, logoW, logoH);
  blendMode(BLEND);
  noTint();

  // nav items
  var btnW = canW * 0.18;
  var btnX = [canW * 0.04, canW - canW * 0.04 - btnW];

  for (var i = 0; i < navLabels.length; i++) {
    var bx = btnX[i];
    var by = 0;

    // hover glow
    var isHov = (mouseX > bx && mouseX < bx + btnW &&
                 mouseY > by && mouseY < by + NAV_H);
    hoverAlpha[i] += ((isHov ? 1 : 0) - hoverAlpha[i]) * 0.12;

    // active indicator
    if (i === page) {
      noStroke();
      fill(180, 0, 255, 40);
      rect(bx, 0, btnW, NAV_H);
      fill(180, 0, 255, 160 - fade);
      rect(bx + btnW * 0.1, NAV_H - 3, btnW * 0.8, 3);
    }

    // hover fill
    if (hoverAlpha[i] > 0.01) {
      noStroke();
      fill(255, 255, 255, hoverAlpha[i] * 20 - fade);
      rect(bx, 0, btnW, NAV_H);
    }

    // label
    textFont(font[0]);
    var ts = constrain(NAV_H * 0.30, 14, 26);
    textSize(ts);
    noStroke();
    fill(255, 255 - fade);
    text(navLabels[i], bx + btnW / 2 - textWidth(navLabels[i]) / 2,
         NAV_H / 2 + ts * 0.38);
  }
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function drawHome() {
  var pad   = 30;
  var y0    = NAV_H + pad;

  // ── hero section ──
  var heroW = min(canW - pad * 2, 960);
  var heroH = heroW * (img[1].height / img[1].width);
  var heroX = canW / 2 - heroW / 2;

  // shadow under hero
  noStroke();
  fill(0, 120);
  rect(heroX + 12, y0 + 12, heroW, heroH, 10);
  image(img[1], heroX, y0, heroW, heroH, 0, 0, img[1].width, img[1].height);

  // ── bio card ──
  var cardY = y0 + heroH + 30;
  var cardW = min(canW - pad * 2, 860);
  var cardX = canW / 2 - cardW / 2;
  var cardH = max(260, cardW * 0.28);

  // card bg
  noStroke();
  fill(30, 0, 65, 210);
  rect(cardX, cardY, cardW, cardH, 8);
  stroke(180, 0, 255, 60);
  strokeWeight(1);
  noFill();
  rect(cardX, cardY, cardW, cardH, 8);

  // name heading
  noStroke();
  fill(220, 160, 255);
  textFont(font[0]);
  var nameSize = constrain(cardW * 0.06, 22, 52);
  textSize(nameSize);
  text("Evan Bailey", cardX + 30, cardY + nameSize * 1.3);

  // bio body
  fill(200, 185, 215);
  var bodySize = constrain(cardW * 0.022, 13, 18);
  textSize(bodySize);
  textWrap(WORD);
  text(
    "Hello my name is Evan Bailey and im the creator of this website. I made this website as a general purpose website for the future. " +
    "Hoping that more use for this site in the future but all I have right now is the tabs you see above." +
    "I have a intrest on the beauty in photography hoping to make this hobby pay for itself. " +
    "Other than photography I have been coding since 2017 and that ability is how i created this site. " +
    "Growing up puzzles, challenges, logic games have always been amusing to me. " +
    "That is what brings me to programming keeping my always tasked with a cool outcome.",
    cardX + 30, cardY + nameSize * 2.0, cardW - 60
  );

  // ── footer ──
  drawFooter();
}

function drawPhotos() {
  var pad  = 30;
  var y0   = NAV_H + pad;
  var gap  = 15;
  var cell = (canW - pad * 2) / GAL_COLS;

  var x = pad;
  var y = y0;

  for (var i = 2; i < img.length; i++) {
    // shadow
    noStroke();
    fill(0, 100);
    rect(x + 8, y + 8, cell - gap, cell - gap, 6);

    // image
    var s = cell - gap;
    image(img[i], x, y, s, s, 0, 0, img[i].width, img[i].height);

    // hover overlay
    var inCell = (mouseX > x && mouseX < x + s &&
                  mouseY > y && mouseY < y + s);
    if (inCell) {
      noStroke();
      fill(180, 0, 255, 40);
      rect(x, y, s, s, 6);
    }

    x += cell;
    if (x + cell > canW) {
      x = pad;
      y += cell;
    }
  }

  drawFooter();
}

function drawFooter() {
  noStroke();
  fill(15, 0, 35);
  rect(0, height - 55, canW, 55);

  textFont(font[0]);
  var fs = constrain(canW * 0.018, 12, 18);
  textSize(fs);
  fill(140, 80, 200);
  var label = "Created By: Evan Bailey";
  text(label, canW / 2 - textWidth(label) / 2, height - 55 / 2 + fs * 0.38);
}

function mousePressed() {
  var btnW = canW * 0.18;
  var btnX = [canW * 0.04, canW - canW * 0.04 - btnW];

  for (var i = 0; i < navLabels.length; i++) {
    if (mouseX > btnX[i] && mouseX < btnX[i] + btnW &&
        mouseY > 0       && mouseY < NAV_H) {
      if (i !== page) {
        page = i;
        window.scrollTo(0, 0);
        windowResized(); 
      }
    }
  }
}
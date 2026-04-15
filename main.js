var font       = [];
var img        = [];
var nav        = [];
var page       = 0;
var canW, canH;
var hoverAlpha = [];
var NAV_H, GAL_COLS;

// ── Performance: pre-baked gallery tiles ─────────────────────────────────────
// Each entry: { src, tile } where tile is a p5.Graphics scaled once.
var tiles      = [];
var tilesReady = false;
var tileSize   = 0;

var navLabels = ["Home", "Photos"];

// ── Redraw flag — only redraw when something actually changed ─────────────────
var needsRedraw   = true;
var lastMouseX    = -1;
var lastMouseY    = -1;
var lastScrollY   = -1;

function setup() {
  canW  = windowWidth;
  canH  = windowHeight;
  NAV_H = max(60, canW * 0.065);

  font.push(loadFont("PresqueElegante.otf"));

  // Images
  var files = [
    "logo.png","thing.jpeg","flower1.jpg","flower2.jpeg","flower3.jpeg",
    "flower4.jpeg","plant1.jpeg","plant2.jpeg","macbook.jpeg","bpa.JPG",
    "hallway.JPG","water.JPG","TuffWaterPhoto.JPG","vada.JPG","glowtree.JPG",
    "carlight.JPG","camera.JPG","flower 5.jpg","deer1.jpg","deer2.jpg","deer3.jpg"
  ];
  for (var i = 0; i < files.length; i++) img.push(loadImage(files[i]));

  for (var i = 0; i < navLabels.length; i++) hoverAlpha.push(0);

  GAL_COLS = galCols(canW);

  createCanvas(canW, pageHeight());
  textFont(font[0]);

  // Build tiles after images have loaded (p5 loads async but setup runs after)
  // Use loadImage callback pattern instead: rebuild tiles in draw() once
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function galCols(w) { return w >= 1200 ? 4 : w >= 800 ? 3 : w >= 500 ? 2 : 1; }

function pageHeight() {
  var pad     = 30;
  var gap     = 15;
  var cell    = (canW - 60) / GAL_COLS;
  var galRows = ceil((img.length - 2) / GAL_COLS);
  var photosH = NAV_H + pad + galRows * (cell + gap) + 80;
  var homeH   = max(canH, NAV_H + 60 + canW * 0.44 + 250 + 480);
  return page === 0 ? homeH : photosH;
}

// Build scaled-down Graphics tiles for the gallery to avoid re-sampling every frame.
function buildTiles() {
  // Dispose any existing tiles
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i]) tiles[i].remove();
  }
  tiles = [];

  var gap  = 15;
  var cell = (canW - 60) / GAL_COLS;
  var s    = cell - gap;
  tileSize = s;

  for (var i = 2; i < img.length; i++) {
    var src = img[i];
    if (!src || src.width === 0) { tiles.push(null); continue; }

    var isLandscape = src.width >= src.height;
    var tw, th, tx, ty;

    if (isLandscape) {
      tw = s; th = s;
      tx = 0; ty = 0;
    } else {
      tw = src.width / (src.width / (s / 2));
      th = s;
      tx = s / 4; ty = 0;
    }

    // Create an off-screen buffer at the display size
    var g = createGraphics(s, s);
    g.noStroke();
    // Dark background for portrait images to fill the cell
    g.background(44, 0, 88);

    // Shadow
    g.fill(0, 100);
    if (isLandscape) {
      g.rect(8, 8, tw, th, 6);
    } else {
      g.rect(tx + 8, 8, tw, th, 6);
    }

    // Image
    if (isLandscape) {
      g.image(src, 0, 0, tw, th, 0, 0, src.width, src.height);
    } else {
      g.image(src, tx, 0, tw, th, 0, 0, src.width, src.height);
    }

    tiles.push(g);
  }
  tilesReady = true;
}

// ── Resize ────────────────────────────────────────────────────────────────────
function windowResized() {
  canW     = windowWidth;
  canH     = windowHeight;
  NAV_H    = max(60, canW * 0.065);
  GAL_COLS = galCols(canW);

  resizeCanvas(canW, pageHeight());
  tilesReady = false; // Rebuild tiles at new size
  needsRedraw = true;
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function draw() {
  var sy = window.pageYOffset || 0;

  // Build tiles on first draw (images are loaded by now)
  if (!tilesReady) buildTiles();

  // Only redraw if something changed
  var mx = mouseX, my = mouseY;
  if (!needsRedraw && mx === lastMouseX && my === lastMouseY && sy === lastScrollY) return;

  needsRedraw  = false;
  lastMouseX   = mx;
  lastMouseY   = my;
  lastScrollY  = sy;

  background(44, 0, 88);

  if (page === 0) drawHome();
  else            drawPhotos();

  drawNav(sy);
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function drawNav(sy) {
  var fade = constrain(sy * 0.4, 0, 160);

  noStroke();
  fill(20, 0, 50, 200 - fade);
  rect(0, 0, canW, NAV_H);

  stroke(180, 0, 255, max(0, 80 - fade));
  strokeWeight(1);
  line(0, NAV_H, canW, NAV_H);

  // Logo
  var logoH = NAV_H * 0.80;
  var logoW = logoH * (img[0].width / img[0].height);
  var logoX = canW / 2 - logoW / 2;
  var logoY = NAV_H / 2 - logoH / 2;
  tint(255, max(0, 255 - fade));
  blendMode(SCREEN);
  image(img[0], logoX, logoY, logoW, logoH);
  blendMode(BLEND);
  noTint();

  // Nav buttons
  var btnW = canW * 0.18;
  var btnX = [canW * 0.04, canW - canW * 0.04 - btnW];

  for (var i = 0; i < navLabels.length; i++) {
    var bx  = btnX[i];
    var isH = (mouseX > bx && mouseX < bx + btnW && mouseY > 0 && mouseY < NAV_H);

    hoverAlpha[i] += ((isH ? 1 : 0) - hoverAlpha[i]) * 0.12;
    if (abs(hoverAlpha[i] - (isH ? 1 : 0)) > 0.005) needsRedraw = true;

    if (i === page) {
      noStroke();
      fill(180, 0, 255, 40);
      rect(bx, 0, btnW, NAV_H);
      fill(180, 0, 255, max(0, 160 - fade));
      rect(bx + btnW * 0.1, NAV_H - 3, btnW * 0.8, 3);
    }

    if (hoverAlpha[i] > 0.01) {
      noStroke();
      fill(255, hoverAlpha[i] * 20);
      rect(bx, 0, btnW, NAV_H);
    }

    textFont(font[0]);
    var ts = constrain(NAV_H * 0.30, 14, 26);
    textSize(ts);
    noStroke();
    fill(255, max(0, 255 - fade));
    text(navLabels[i], bx + btnW / 2 - textWidth(navLabels[i]) / 2, NAV_H / 2 + ts * 0.38);
  }
}

// ── Home ──────────────────────────────────────────────────────────────────────
function drawHome() {
  var pad = 30;
  var y0  = NAV_H + pad;

  // Hero image
  var heroW = min(canW - pad * 2, 960);
  var heroH = heroW * (img[1].height / img[1].width);
  var heroX = canW / 2 - heroW / 2;

  noStroke();
  fill(0, 120);
  rect(heroX + 12, y0 + 12, heroW, heroH, 10);
  image(img[1], heroX, y0, heroW, heroH, 0, 0, img[1].width, img[1].height);

  // Bio card
  var cardY = y0 + heroH + 30;
  var cardW = min(canW - pad * 2, 860);
  var cardX = canW / 2 - cardW / 2;
  var cardH = max(260, cardW * 0.28);

  noStroke();
  fill(30, 0, 65, 210);
  rect(cardX, cardY, cardW, cardH, 8);
  stroke(180, 0, 255, 60);
  strokeWeight(1);
  noFill();
  rect(cardX, cardY, cardW, cardH, 8);

  noStroke();
  fill(220, 160, 255);
  textFont(font[0]);
  var nameSize = constrain(cardW * 0.06, 22, 52);
  textSize(nameSize);
  text("Evan Bailey", cardX + 30, cardY + nameSize * 1.3);

  fill(200, 185, 215);
  var bodySize = constrain(cardW * 0.022, 13, 18);
  textSize(bodySize);
  textWrap(WORD);
  text(
    "Hello, my name is Evan Bailey and I'm the creator of this website. I made this site as a " +
    "general-purpose home for future projects. Right now I'm showcasing photography — a hobby " +
    "I hope will one day pay for itself. I've been coding since 2017, and that skill is what " +
    "brought this site to life. Growing up, puzzles, challenges, and logic games always kept me " +
    "engaged, and programming is the perfect extension of that: always another cool problem to solve.",
    cardX + 30, cardY + nameSize * 2.0, cardW - 60
  );

  drawFooter();
}

// ── Photos ────────────────────────────────────────────────────────────────────
function drawPhotos() {
  if (!tilesReady) return;

  var pad  = 30;
  var y0   = NAV_H + pad;
  var gap  = 15;
  var cell = (canW - pad * 2) / GAL_COLS;
  var s    = cell - gap;

  var col = 0, row = 0;

  for (var i = 0; i < tiles.length; i++) {
    var x = pad + col * cell;
    var y = y0 + row * cell;

    if (tiles[i]) {
      // Draw the pre-baked tile — one image() call, no re-sampling
      image(tiles[i], x, y, s, s);
    } else {
      // Placeholder if tile not yet built
      noStroke();
      fill(44, 0, 88);
      rect(x, y, s, s, 6);
    }

    // Hover overlay (cheap: just a coloured rect)
    var inCell = (mouseX > x && mouseX < x + s && mouseY > y && mouseY < y + s);
    if (inCell) {
      noStroke();
      fill(180, 0, 255, 50);
      rect(x, y, s, s, 6);

      // Subtle white border on hover
      stroke(255, 60);
      strokeWeight(1.5);
      noFill();
      rect(x, y, s, s, 6);
      noStroke();
    }

    col++;
    if (col >= GAL_COLS) { col = 0; row++; }
  }

  drawFooter();
}

// ── Footer ────────────────────────────────────────────────────────────────────
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

// ── Input ─────────────────────────────────────────────────────────────────────
function mousePressed() {
  var btnW = canW * 0.18;
  var btnX = [canW * 0.04, canW - canW * 0.04 - btnW];

  for (var i = 0; i < navLabels.length; i++) {
    if (mouseX > btnX[i] && mouseX < btnX[i] + btnW && mouseY > 0 && mouseY < NAV_H) {
      if (i !== page) {
        page = i;
        window.scrollTo(0, 0);
        tilesReady = false; // Rebuild tiles for possibly-new cell size
        windowResized();
        needsRedraw = true;
      }
    }
  }
}

function mouseMoved()   { needsRedraw = true; }
function mouseDragged() { needsRedraw = true; }
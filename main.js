var ww = 0;
var wh = 0;
var size = 0;
var delh = 0;
var img = [];
var butt = []
var font = []
var ml = 0;

//pages
var pa = ["Home", "Photos"]
//page sizes
var ps = []
var p = 0

function setup() {
	ww = windowWidth
	wh = windowHeight
	size = 1 - ((1920 - ww) + (861 - wh)) / 2781
	img.push(loadImage("logo.png"))
	img.push(loadImage("thing.jpeg"))
	img.push(loadImage("flower1.jpg"))
	img.push(loadImage("flower2.jpeg"))
	img.push(loadImage("flower3.jpeg"))
	img.push(loadImage("flower4.jpeg"))
	img.push(loadImage("plant1.jpeg"))
	img.push(loadImage("plant2.jpeg"))
	img.push(loadImage("macbook.jpeg"))
	print(((img.length - 2) / 4))
	var len = ((img.length - 2) / 4)
	var ot = (ww - 80 * size) / (440 * size)
	if(round(len) < len) {
		len = round(len) + 1
	}
	len = round(len)
	print(len)
	//((100 * size) * ot) * len
	if(((100 * size) * ot) * len + 130 * size > wh) {

	}
	ps = [[ww, wh + 250], [ww, wh + ((100 * size) * ot) * len + 130 * size]]
	font.push(loadFont("PresqueElegante.otf"))
	var bus = (ww - 220 * size) / pa.length
	for(var i = 0; i < pa.length; i++) {
		if(i + 1 > pa.length / 2) {
	butt.push(new buttons(i * bus + 220 * size, 0, bus, 130 * size, 1, i, 0, pa[i]))
		}else{
	butt.push(new buttons(i * bus, 0, bus, 130 * size, 1, i, 0, pa[i]))
		}
	}
	createCanvas(ps[p][0], ps[p][1]);
	background(255);
}

function loadpage(Pn) {
	for(var i = pa.length; i < butt.length; i++) {
		butt[i].d = 1;
	}
p = Pn
reshapecan(ps[p][0], ps[p][1])
}


function ui () {
	push()
	push()
	stroke(0, 255 - window.pageYOffset * size * 5)
	fill(255, 255 - window.pageYOffset * size * 5)
	rect(ps[p][0] / 2 - (220 * size) / 2, 0, 220*size,129.9 * size)
	tint(255, 255 - window.pageYOffset * size * 5)
	image(img[0], ps[p][0] / 2 - (220 * size) / 2, 65 * size - (110 * size) / 2, 220 * size, 110 * size)
	//rect(10 * size, 65 * size - 32.5 * size, 65 * size, 65 * size)
	pop()
	var ady = 130 * size
	if(p == 0) {
		push()
		noStroke()
		fill(0, 150)
		rect(80 * size, 120 * size + ady, 800 * size, (800 / 1.00208768267) * size, 6 * size)
		image(img[1], 100 * size, 100 * size + ady, 800 * size, (800 / 1.00208768267) * size)
		pop()
		push()
		pop()
		push()
	fill(0, 150)
	rect(960 * size, 120 * size + ady, 800 * size, (800 / 1.00208768267) * size, 6 * size)
	fill(43, 0, 82)
	rect(980 * size, 100 * size + ady, 800 * size, (800 / 1.00208768267) * size)
	textSize(64 * size)
	textFont(font[0])
	fill(255)
	text("Evan Bailey", 990 * size, 120 * size + ady + textSize())
	textSize(24 * size)
		textFont("ASSCOCK")
	textWrap(WORD)
	text("Hello my name is Evan Bailey and im the creator of this website. I made this website as a general purpose website for the future. Hoping that more use for this site in the future but all I have right now is the tabs you see above.I have a intrest on the beauty in photography hoping to make this hobby pay for itself. Other than photography I have been coding since 2017 and that ability is how i created this site. Growing up puzzles, challenges, logic games have always been amusing to me. That is what brings me to programming keeping my always tasked with a cool outcome.", 1000 * size, 600 * size + ady + textSize(), ww - 1100 * size)
	pop()
	}
	if(p == 1) {
		var x = 40 * size;
		var y = ady + 40 * size;
		var ims = (ww - 80 * size) / (440 * size)
		for(var i = 2; i < img.length; i++) {
			push()
			noStroke()
			fill(0, 150)
			rect(x - 20 * size, y + 20 * size, (100 * size) * ims, (100 * size) * ims)
			pop()
		image(img[i], x, y, (100 * size) * ims, (100 * size) * ims)
		x += (110 * size) * ims
		if(x + (100 * size) * ims > ww) {
			y += (110 * size) * ims
			x = 40 * size;
		}
		}
	}
	stroke(0)
	strokeWeight(0.8 * size)
	fill(255)
	push()
	textFont(font[0])
	textSize(24*size)
	text("Created By: Evan Bailey", ww / 2 - textWidth("Created By: Evan Bailey") / 2, ps[p][1] - textSize() - 10 * size)
	pop()
	pop()
}

function buttons(x,y,w,h,b,c,ho,va) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.b = b;
	this.c = c;
	this.ho = ho;
	this.va = va;
	this.hov = 0;
	this.pre = 0;
	this.cot = [255]
	this.d = 0;
}

buttons.prototype.draw = function() {
	push()
	if(this.b == 1) {
	stroke(0, 255  - window.pageYOffset * size * 5)
	fill(abs((255 - 159) - this.cot[0]), abs((255 - 54) - this.cot[0]), 255, 255  - window.pageYOffset * size * 5)
	rect(this.x, this.y, this.w, this.h)
	noStroke()
	fill(abs(0 - this.cot[0]),255  - window.pageYOffset * size * 5)
	//fill(abs((255 - ) - this.cot[0]), 255  - window.pageYOffset * size * 5)
	textSize(32 * size)
	textFont(font[0])
	text(this.va, this.x + this.w / 2 - textWidth(this.va) / 2, this.y + this.h / 2 + textSize() / 2)
	}
	if(this.hov == 1) {
		this.cot[0] -= (this.cot[0] - 0) / 2 * delh 
	}else{
		this.cot[0] -= (this.cot[0] - 255) / 2 * delh 
	}
	pop()
}

buttons.prototype.use = function() {
if(this.x < mouseX && this.x + this.w > mouseX && this.y < mouseY && this.y + this.h > mouseY) {
		this.hov = 1;
	}else{
		this.hov = 0;
	}
	if(this.hov == 1 && mouseIsPressed) {
		if(this.ho == 0) {
			if(ml == 0) {
				this.pre = 1;
			}else{
				this.pre = 0;
			}
		}else{
			this.pre = 1;
		}
	}else{
		this.pre = 0;
	}
	if(this.pre == 1 && this.b == 1) {
		loadpage(this.c)
	}
}

function reshapecan(w,h) {
resizeCanvas(w,h)
	ww = w;
	wh = h;
}

function draw() {
	delh = deltaTime / 20
	background(68, 0, 130);
	ui()
	for(var i = 0; i < butt.length; i++) {
	butt[i].use()
	butt[i].draw()
	if(butt[i].d == 1) {
		butt.splice(i, i+1)
	}
	}
	if(mouseIsPressed) {
		ml = 1;
	}else{
		ml = 0;
	}
}
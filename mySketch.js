var ww = 0;
var wh = 0; 
var size = 0;
var page = 1;
var ps = []
var img = []
var delh = 0;
var sfps = 0;
var woweeee = 0;
var sfpsl = 0;
var mhz = [30, 50, 60, 120, 144, 165, 240, 360, 500]
var butt = []
var ml = 0;
var lp = 0;
var chp = 1;
var sw = 0;
var sh = 0;
var places = []
var pb = []
var lat = 0;
var lon = 0;
var mapim = 0;
var ebos = 0;
var onbt = []
var onbl = []

function setup() {
	ww = windowWidth;
	wh = windowHeight;
	sw = windowWidth;
	sh =  windowHeight;
	navigator.geolocation.getCurrentPosition(
   pos => findMentalHealthNearby(pos.coords.latitude, pos.coords.longitude),//pos.coords.latitude, pos.coords.longitude),
		pos => lat = pos.coords.latitude, pos => lon = pos.coords.longitude,
  err => console.error("Geolocation Error:", err)
);
	size = 1 - ((1920 - ww) + (861 - wh)) / 2781
		ps = [[ww,1400 * size],[ww,1240 * size],[ww,1400 * size],[ww,1400 * size]]
	createCanvas(ps[page - 1][0], ps[page - 1][1]);
	ww = ps[page - 1][0]
	wh = ps[page - 1][1]
	img.push(loadImage("background1.png"))
	img.push(loadImage("logo.png"))
	img.push(loadImage("Hands.jpeg"))
	img.push(loadImage("brain.jpeg"))
	img.push(loadImage("question.png"))
	img.push(loadImage("greenbrain.png"))
	img.push(loadImage("betterhelp.png"))
	img.push(loadImage("nami.png"))
	img.push(loadImage("talkspace.png"))
	img.push(loadImage("MHFA_Logo.png"))
	img.push(loadImage("commonground.jfif"))
	img.push(loadImage("image.png"))
	img.push(loadImage("7cups.png"))
	img.push(loadImage("drplus.png"))
	img.push(loadImage("background2.png"))
	img.push(loadImage("background3.png"))
	img.push(loadImage("background4.png"))
	onbt = ["BetterHelp","Nami","Talkspace","Mental Health First Aid","Common Ground","Cerebral","7Cups","Dr+ On Demand"]
	onbl = ["https://www.betterhelp.com/","https://www.nami.org/","https://www.talkspace.com/","https://mentalhealthfirstaid.org/mental-health-resources/","https://commongroundhelps.org/","https://cerebral.com/","https://www.7cups.com/","https://doctorondemand.com"]
		makeMap()
	push()
	textSize(40 * size)
	var w = (textWidth("HopeWave") + 238.7 * size) / 4
	butt.push(new buttons(ww / 2 - textWidth("HopeWave") / 2 - (9.4 + 120) * size, 175 * size, w, 40 * size,1))
	butt.push(new buttons(ww / 2 - textWidth("HopeWave") / 2 - (9.4 + 120) * size + w, 175 * size, w, 40 * size,2))
	butt.push(new buttons(ww / 2 - textWidth("HopeWave") / 2 - (9.4 + 120) * size + w * 2, 175 * size, w, 40 * size,3))
	butt.push(new buttons(ww / 2 - textWidth("HopeWave") / 2 - (9.4 + 120) * size + w * 3, 175 * size, w, 40 * size,4))
	pop()
}
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "MyMentalHealthApp/1.0 (myemail@example.com)"
    }
  });

  const data = await res.json();
  const a = data.address;

  return {
    street: a.road || a.pedestrian || a.neighbourhood || a.path || "",
    city: a.city || a.town || a.village || a.hamlet || "",
    state: a.state || "",
    postcode: a.postcode || ""
  };
}

async function findMentalHealthNearby(lat, lon) {
  const radius = (88.5139 * 1000); // 20 km

  const query = `
    [out:json];
    (
      node["healthcare"="mental_health"](around:${radius},${lat},${lon});
      node["healthcare"="counselling"](around:${radius},${lat},${lon});
	   node["healthcare"="therapy"](around:${radius},${lat},${lon});
		node["healthcare"="psychologist"](around:${radius},${lat},${lon});
	  node["office"="private_counselling"](around:${radius},${lat},${lon});
    );
    out center;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  });

  const json = await res.json();

  if (!json.elements || json.elements.length === 0) {
    console.warn("⚠ No mental-health locations found.");
    return;
  }

  for (let place of json.elements) {
    const name = place.tags.name || "Unnamed Facility";

    const plat = place.lat;
    const plon = place.lon;
    const addr = await reverseGeocode(plat, plon);

    const fullAddress =
      `${addr.street}, ${addr.city}, ${addr.state} ${addr.postcode}`.trim();
	  places.push([])
     places[places.length - 1][0] = name;
     places[places.length - 1][1] =fullAddress;
	  places[places.length - 1][2] = plat;
	  places[places.length - 1][3] = plon;
	  places[places.length - 1][4] = makeBingLink(plat, plon, name, fullAddress);
	 // print(name)
  }
}

function makeBingLink(lat, lon, name, address) {
  const fullQuery = address ? `${name} ${address}` : name;
  const encodedQuery = encodeURIComponent(fullQuery);
  return `https://www.bing.com/maps?q=${encodedQuery}`;
}

function makeMap() {
	  generateStaticMap(width, height, 10, (imgg) => {
    mapim = imgg;
  });
}

function generateStaticMap(w, h, zoom, callback) {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    const tileSize = 256;
    const tilesX = ceil(w / tileSize) + 2;
    const tilesY = ceil(h / tileSize) + 2;

    const xTile = (lon + 180) / 360 * pow(2, zoom);
    const yTile = (1 - log(tan(radians(lat)) + 1 / cos(radians(lat))) / PI) / 2 * pow(2, zoom);

    const centerX = floor(xTile);
    const centerY = floor(yTile);

    const offsetX = (xTile - centerX) * tileSize;
    const offsetY = (yTile - centerY) * tileSize;

    // Load all tiles
    let tilePromises = [];
    for (let i = -floor(tilesX / 2); i <= floor(tilesX / 2); i++) {
      for (let j = -floor(tilesY / 2); j <= floor(tilesY / 2); j++) {
        const tx = centerX + i;
        const ty = centerY + j;
        const url = `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`;
        tilePromises.push(
          new Promise((resolve) => {
            loadImage(url, (img) => {
              resolve({ img, x: i * tileSize, y: j * tileSize });
            });
          })
        );
      }
    }

    const tiles = await Promise.all(tilePromises);
    let mapGraphic = createGraphics(w, h);
    mapGraphic.push();
    mapGraphic.translate(w / 2 - offsetX, h / 2 - offsetY);
    for (let t of tiles) {
      mapGraphic.image(t.img, t.x, t.y);
    }
    mapGraphic.pop();

    callback(mapGraphic);
  });
}


function Ui() {
		if(page == 1) {
		image(img[0], 0, -180 * size,ww,wh + 180)
			push()
			noStroke()
			fill(86, 130, 93,200)
			rect(ww / 3 - 20 * size, 360 * size, ww * (2/3) - 40 * size, 340 * size)
			fill(114, 173, 124)
			rect(ww / 3, 340 * size, ww * (2/3) - 40 * size, 340 * size)
			fill(86, 130, 93,200)
			rect(80 * size, 340 * size, 380 * size, 380 * size)
			fill(114, 173, 124)
			rect(100 * size, 320 * size, 380 * size, 380 * size)
			image(img[2], 110 * size, 330 * size, 360 * size, 360 * size)
			pop()
			push()
								stroke(0)
				strokeWeight(2)
			textWrap(WORD)
			textSize(46 * size)
			text("What we do:",ww / 3 + 15 * size, 340 * size + textSize(),ww * (2/3) - 55 * size, 340 * size- textSize())
			textSize(26 * size)
			text("HopeWave is a non profit organization that is for the people. We spread information and awareness about mental health to local and global places. Our objective is to increase people’s self esteem and overall moral. We prioritize everyone’s health equally, our organization does not discriminate. A lot of people are struggling with mental health issues as of late. We want to decrease that number to as little as possible.", ww / 3 + 15 * size, 440 * size + textSize(),ww * (2/3) - 55 * size, 340 * size- textSize())
			pop()
			push()
			noStroke()
			fill(86, 130, 93,200)
			rect(40 * size, 860 * size, ww * (2/3) - 40 * size, 440 * size)
			fill(114, 173, 124)
			rect(60 * size, 840 * size, ww * (2/3) - 40 * size, 440 * size)
				fill(86, 130, 93,200)
			rect(ww * (2/3) + 120 * size, 880 * size, 380 * size, 380 * size)
			fill(114, 173, 124)
			rect(ww * (2/3) + 140 * size, 860 * size, 380 * size, 380 * size)
			image(img[3], ww * (2/3) + 150 * size, 870 * size, 360 * size, 360 * size)
			pop()
			push()
								stroke(0)
			strokeWeight(2)
			textWrap(WORD)
			fill(255)
						textSize(46 * size)
			text("Why we do what we do:",75 * size, 840 * size + textSize(),ww * (2/3) - 40 * size - textSize(), 580 * size- textSize())
						textSize(25 * size)
			text("HopeWave believes that everyone should have an equal opportunity to become a healthy individual. We have 3 main motives at HopeWave. The first motive is safety. HopeWave wants a safe society. Individuals who have mental health issues tend to be dangerous to themselves and possibly the community. With less people that have mental health issues, comes a safer place. Our second motive here at HopeWave is success. We believe that the key to success starts with a healthy body and a healthy mind. Mental health issues, or problems, are signs of an unhealthy brain. The third main motive is the people's pleasure. We here at HopeWave want everyone to be happy. Most likely if you have some mental health problems, then you will also most likely be unhappy. Many people struggle with this, and that's why we want to make a difference and change peoples lives.", 75 * size, 940 * size + textSize(),ww * (2/3) - 40 * size - textSize(), 580 * size- textSize())
			pop()
		}
	if(page == 2) {
		image(img[14], 0, -180 * size,ww,wh + 180 * size)
		push()
		noStroke()
					fill(86, 130, 93,200)
		if(places.length == 0) {
			rect(ww / 2 - 20 * size, 260 * size, ww / 2 - 30 * size, 120 * size)
		fill(114, 173, 124)
			rect(ww / 2, 240 * size, ww / 2 - 30 * size, 120 * size)
	fill(255)
		}else{
				rect(ww / 2 - 20 * size, 260 * size, ww / 2 - 30 * size, pb.length * 75* size + 112 * size)
		fill(114, 173, 124)
			rect(ww / 2, 240 * size, ww / 2 - 30 * size, pb.length * 75* size + 112 * size)
	fill(255)
		}
		textSize(62 * size)
		text("Local Areas:",ww /2 + (ww / 2 - textWidth("Local Areas:")) / 2 * size, 260 * size, ww / 2 - 30 * size, wh - 280 * size)
		textSize(18 * size)
		text("There Are No Loactions Near You.",ww /2 + (ww / 2 - textWidth("There Are No Loactions Near You.")) / 2 * size, 340 * size)
		pop()
		if(places.length == pb.length == false) {
			butt.push(new buttons(ww / 2 + (ww / 2 - ww / 4) / 2, (360 + 42 + 75 * (pb.length - 1)) * size, ww / 4 * size, 70 * size, 5, pb.length))
			pb.push("beans")
		}
		if(240 * size + pb.length * 75* size + 100 * size > wh) {
			reshapecan(ww, wh + ((240 * size + pb.length * 80* size + 100 * size) - wh))
			ps[1][1] = wh;
		}
		push()
		noStroke()
		fill(86, 130, 93,200)
		rect(20 * size, (wh - (ww / 2 - 80 * size) + 240 * size) / 2 + 10 * size, ww / 2 - 80 * size, ww / 2 - 80 * size)
		fill(114, 173, 124)
		rect(40 * size, (wh - (ww / 2 - 80 * size) + 240 * size) / 2 - 10 * size, ww / 2 - 80 * size, ww / 2 - 80 * size)
		image(mapim, 50 * size, (wh - (ww / 2 - 80 * size) + 240 * size) / 2, ww / 2 - 100 * size, ww / 2 - 100 * size)
		pop()
		}
	if(page == 3) {
				image(img[15], 0, -180 * size,ww,wh + 180)
		var sit = 8;
		push()
		textSize(120 * size)
		stroke(0)
		strokeWeight(8)
		text("Online Services:", (ww - textWidth("Online Services:")) / 2, 380 * size)
		pop()
		if(ebos < sit) {
			var x = 0;
			var y = 0;
			var mos = round(((ww - 120 * size) / (410 * size)));
			if(mos > 4) {
			mos = 4
			}else{
				mos = round(((ww - 120 * size) / (410 * size)))
			}
			for(var i = 0; i < sit; i++) {

			butt.push(new buttons((ww - (410 * size * mos) + 60 * size) / 2 + (x * (410 * size)), 460 * size + (y * (410 * size)), 350 * size, 350 * size, 6, i))
			x++;
				if(x >= mos) {
					x = 0
					y++;
				}
							ebos++;
			}
		}
	}
	if(page == 4) {
		image(img[16], 0, -180 * size,ww,wh + 180 * size)
			push()
			noStroke()
			fill(86, 130, 93,200)
			rect(ww / 3 - 20 * size, 360 * size, ww * (2/3) - 40 * size, 340 * size)
			fill(114, 173, 124)
			rect(ww / 3, 340 * size, ww * (2/3) - 40 * size, 340 * size)
			fill(86, 130, 93,200)
		   rect(80 * size, 340 * size, 380 * size, 380 * size)
			fill(114, 173, 124)
			rect(100 * size, 320 * size, 380 * size, 380 * size)
			image(img[4], 110 * size, 330 * size, 360 * size, 360 * size)
			pop()
			push()
								stroke(0)
				strokeWeight(2)
			textWrap(WORD)
			textSize(46 * size)
			text("What is a mental health disorder?:",ww / 3 + 15 * size, 340 * size + textSize(),ww * (2/3) - 55 * size, 340 * size- textSize())
			textSize(30 * size)
			text("A mental health disorder(or mental illness) is a condition that significantly affects a person's thoughts, feelings, mood, behavioural or relationships, and interferes with daily function. There are many different types of mental health disorders, such as anxiety disorders, mood disorders, psychotic disorders, eating disorders, and personality disorders. There are more but those are the most common and prevalent ones.", ww / 3 + 15 * size, 440 * size + textSize(),ww * (2/3) - 55 * size, 340 * size- textSize())
			pop()
			push()
			noStroke()
			fill(86, 130, 93,200)
			rect(40 * size, 860 * size, ww * (2/3) - 40 * size, 440 * size)
			fill(114, 173, 124)
			rect(60 * size, 840 * size, ww * (2/3) - 40 * size, 440 * size)
				fill(86, 130, 93,200)
			rect(ww * (2/3) + 120 * size, 880 * size, 380 * size, 380 * size)
			fill(114, 173, 124)
			rect(ww * (2/3) + 140 * size, 860 * size, 380 * size, 380 * size)
		image(img[5], ww * (2/3) + 150 * size, 870 * size, 360 * size, 360 * size)
			pop()
			push()
								stroke(0)
			strokeWeight(2)
			textWrap(WORD)
			fill(255)
						textSize(46 * size)
			text("Examples:",75 * size, 840 * size + textSize(),ww * (2/3) - 40 * size - textSize(), 580 * size- textSize())
						textSize(25 * size)
			text("Some Psychotic disorders are things like hallucinations or the most common one, Schizophrenia. Eating disorders include things like overeating, or undereating. This disorder is usually caused by poor body image of oneself. personality disorders are in a vast variety, they usually are long lasting issues in a person. They tend to start during early childhood or early adulthood. The main cause of personality disorders usually is childhood trauma that takes over. Anxiety and mood disorders, Some anxiety disorders are things such as social anxiety disorder and panic disorder. Some symptoms are restlessness, difficulty sleeping, and difficulty concentrating. Some mood disorders are things such as depression and bipolar disorder. Symptoms of depression are constant sadness and feelings of no hope. Bipolar disorder symptoms are extreme mood, energy, and activity level shifts.", 75 * size, 940 * size + textSize(),ww * (2/3) - 40 * size - textSize(), 580 * size- textSize())
			pop()
		}
		for(var i = 0; i < butt.length; i++) {
	butt[i].draw()
			if(butt[i].d == 1) {
				butt.splice(i, 1)
			}
	}
	push()
	grad(0, 0, ww, 180 * size, color(114, 173, 124,255), color(114, 173, 124, 0))
	pop()
		push()
	noStroke()
		textSize(40 * size)
	fill(114, 173, 124, 255 - window.pageYOffset * size * 3)
  rect(ww / 2 - textWidth("HopeWave") / 2 - (10 + 120) * size, 0, textWidth("HopeWave") + 240 * size, 175 * size)
	pop()
	fill(255)
	textSize(40 * size)
	push()
	stroke(0, 255 - window.pageYOffset * size * 4)
	fill(255,255 - window.pageYOffset * size * 4)
	noStroke()
	rect(ww /2 - (100 * size) / 2, 60 * size, 80 * size, 80 * size, 15 * size)
	pop()
	push()
	tint(255, 255,255,255- window.pageYOffset * size * 4)
	image(img[1], ww /2 - (100 * size) / 2, 60 * size, 80 * size, 80 * size)
	pop()
	text("HopeWave", ww / 2 - textWidth("HopeWave") / 2 - 10 * size, textSize() + 5 * size)
}

var anim = [0,0,0,0,0]

function loadpage() {
	//anim[0] += 1 * delh;
	var hof = 200	
	if(sfps == 30 || sfps == 50) {
	hof = 625
	}
	var h = sh + window.pageYOffset
	if(anim[0] == 0 && anim[1] < h + (200 + hof) * size - 15) {
	anim[1] -= ((anim[1] - h- (200 + hof)*size) / 4) * delh;
	}else{
			if(anim[0] == 2 == false) {
			if(anim[0] == 0) {
								//anim[1] = wh + window.pageYOffset;
				resizeCanvas(ps[chp - 1][0], ps[chp - 1][1])
				background(255)
				ww = ps[chp - 1][0]
				wh = ps[chp - 1][1]
			   anim[0] = 1;
				var but = [];
				pb = []
				ebos = 0;
				but = [butt[0],butt[1],butt[2],butt[3]]
				butt = but
			}
		}
	}
	if(anim[0] == 1 && anim[2] < h + (400 + hof) * size - 5) {
		anim[2] -= ((anim[2] - h- (400 + hof)*size) / 4) * delh
		anim[3] -= ((anim[3] - 255)/32) * delh
			page = chp;
						anim[1] = wh + window.pageYOffset + hof * size;
	}else{
		if(anim[0] == 0 == false) {
		anim[0] = 2
		}
	}
	if(anim[0] == 2) {
		lp = 0;
		anim = [0,0,0,0,0]
	}
	push()
	noStroke()
	fill(114, 173, 124, 255 - anim[3])
	rect(0, anim[2] - (200 + hof) * size, sw, anim[1])
	triangle(0, anim[1] - (200 + hof) * size, sw, anim[1] - (200 + hof) * size, sw, anim[1] - hof * size);
	triangle(0, anim[2]- (400 + hof) * size, sw, anim[2] - (200 + hof) * size, 0, anim[2] - (200 + hof) * size);
	pop()
}

function grad(x,y,w,h,c1,c2,a) {
for(var i = 0; i < h; i += 1) {
	noFill()
	push()
	let inter = map(i, 0, 0 + h, 0, 1);
  let c = lerpColor(c1, c2, inter);
	strokeWeight(4)
	//red(c1), green(c1), blue(c1), 255 - (255/(h - 1))*i
	stroke(red(c), green(c), blue(c), (255 - (255/(h - 1))*i) - window.pageYOffset * size)
	line(x, y + i, x + w, y + i)
	pop()
}
}

function calcFPS(a) {
	function b() {
		if (f--) c(b);
		else {
			var e = 3 * Math.round(1E3 * d / 3 / (performance.now() - g));
			"function" === typeof a.callback && a.callback(e);
			sfps = e;
		}
	}
	var c = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
	if (!c) return !0;
	a || (a = {});
	var d = a.count || 60,
		f = d,
		g = performance.now();
	b()
}

function closest(array, num) {
	var i = 0;
	var minDiff = 1000;
	var ans;
	for (i in array) {
		var m = Math.abs(num - array[i]);
		if (m < minDiff) {
			minDiff = m;
			ans = array[i];
		}
	}
	return ans;
}

function buttons (x,y,w,h,b,c) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.c = c;
	this.o = [x,y,w,h];
	this.edge = []
	this.oe = []
	this.b = b;
	this.hov = 0;
	this.pre = 0;
	this.oc = 0;
	this.d = 0;
	if(this.b == 1) {
		this.edge = [0,0,0,8*size]
		this.oe = [0,0,0,8*size]
		this.oc = 1;
	}
		if(this.b == 2) {
		this.edge = [0,0,0,0]
		this.oe = [0,0,0,0]
		this.oc = 1;
	}
		if(this.b == 3) {
		this.edge = [0,0,0,0]
		this.oe = [0,0,0,0]
		this.oc = 1;
	}
		if(this.b == 4) {
		this.edge = [0,0,8*size,0]
		this.oe = [0,0,8*size,0]
		this.oc = 1;
	}
	if(this.b == 5) {
		this.edge = [8*size,8*size,8*size,8*size]
		this.oe = [x,w,w,w]
		this.oc = 1;
	}
	if(this.b == 6) {
		this.edge = [0,0,0,0]
		this.oe = [x,y,w,h]
		this.oc = 1;
	}
}

buttons.prototype.draw = function() {
	if(this.b == 1) {
		push()
		this.edge[3] = 8*size
			this.oe[3] = 8*size
		stroke(87, 130, 94,255 - window.pageYOffset * size * 3)
		fill(114, 173, 124,255 - window.pageYOffset * size * 3)
			rect(this.x, this.y, this.w, this.h, this.edge[0], this.edge[1], this.edge[2], this.edge[3])
		fill(87, 130, 94,255 - window.pageYOffset * size * 3)
			triangle(this.x + this.edge[3] /2, this.y + this.h - 1 * size, this.x + this.w, this.y + this.h - this.o[3] / 4, this.x + this.w - this.edge[2] / 1.5, this.y + this.h - 1 * size)
		fill(255, 255 - window.pageYOffset * size * 3)
		textSize(16 * size)
		text("Home", this.x + this.w / 2 - textWidth("Home") / 2, this.y + this.h / 1.7)
		pop()
		if(this.pre === 1 && lp == 0) {
			chp = this.b
			lp = 1;
		}
	}
	if(this.b == 2) {
		push()
		stroke(87, 130, 94,255 - window.pageYOffset * size * 3)
		fill(114, 173, 124,255 - window.pageYOffset * size * 3)
		rect(this.x, this.y, this.w, this.h, this.edge[0], this.edge[1], this.edge[2], this.edge[3])
		fill(87, 130, 94,255 - window.pageYOffset * size * 3)
			triangle(this.x + this.edge[3] /2, this.y + this.h - 1 * size, this.x + this.w, this.y + this.h - this.o[3] / 4, this.x + this.w - this.edge[2] / 1.5, this.y + this.h)
			fill(255, 255 - window.pageYOffset * size * 3)
	textSize(16 * size)
		text("Local", this.x + this.w / 2 - textWidth("Local") / 2, this.y + this.h / 2.5)
		text("Services", this.x + this.w / 2 - textWidth("Services") / 2, this.y + this.h / 1.4)
		pop()
		if(this.pre === 1 && lp == 0) {
			chp = this.b
			lp = 1;
		}
	}
	if(this.b == 3) {
		push()
		stroke(87, 130, 94,255 - window.pageYOffset * size * 3)
		fill(114, 173, 124,255 - window.pageYOffset * size * 3)
		rect(this.x, this.y, this.w, this.h, this.edge[0], this.edge[1], this.edge[2], this.edge[3])
		fill(87, 130, 94,255 - window.pageYOffset * size * 3)
			triangle(this.x + this.edge[3] /2, this.y + this.h - 1 * size, this.x + this.w, this.y + this.h - this.o[3] / 4, this.x + this.w - this.edge[2] / 1.5, this.y + this.h)
			fill(255, 255 - window.pageYOffset * size * 3)
		textSize(16 * size)
		text("Online", this.x + this.w / 2 - textWidth("Online") / 2, this.y + this.h / 2.5)
		text("Services", this.x + this.w / 2 - textWidth("Services") / 2, this.y + this.h / 1.4)
		pop()
		if(this.pre === 1 && lp == 0) {
			chp = this.b
			lp = 1;
		}
	}
	if(this.b == 4) {
		push()
		this.edge[2] = 8*size
		this.oe[2] = 8*size
		stroke(87, 130, 94,255 - window.pageYOffset * size * 3)
		fill(114, 173, 124,255 - window.pageYOffset * size * 3)
		rect(this.x, this.y, this.w, this.h, this.edge[0], this.edge[1], this.edge[2], this.edge[3])
				fill(87, 130, 94,255 - window.pageYOffset * size * 3)
			triangle(this.x + this.edge[3] /2, this.y + this.h - 1 * size, this.x + this.w, this.y + this.h - this.o[3] / 4, this.x + this.w - this.edge[2] / 1.5, this.y + this.h)
			fill(255, 255 - window.pageYOffset * size * 3)
				textSize(16 * size)
		text("Mental", this.x + this.w / 2 - textWidth("Mental") / 2, this.y + this.h / 2.5)
		text("Disorders", this.x + this.w / 2 - textWidth("Disorders") / 2, this.y + this.h / 1.4)
		pop()
		if(this.pre === 1 && lp == 0) {
			chp = this.b
			lp = 1;
		}
	}
	if(this.b == 5) {
		push()
	stroke(87, 130, 94)
		fill(114, 173, 124)
				rect(this.x, this.y, this.w, this.h, this.edge[0], this.edge[1], this.edge[2], this.edge[3])
			fill(87, 130, 94)
			triangle(this.x + this.edge[3] /2, this.y + this.h - 1 * size, this.x + this.w, this.y + this.h - this.o[3] / 4, this.x + this.w - this.edge[2] / 3, this.y + this.h)
		textSize(14 * size)
		fill(255)
		textWrap(WORD)
		text(places[this.c][0] + ", " + places[this.c][1], this.x + 20 * size, this.y + 20 * size, this.w - 20 * size, this.h)
		if(this.pre == 1) {
			window.open(places[this.c][4])
			this.pre = 0;
		}
	pop()
	}
	if(this.b == 6) {
		push()
		stroke(87, 130, 94)
			fill(87, 130, 94)
		rect(this.x, this.y + 10 * size, this.w - 10 * size, this.h - 10 * size, this.edge[0], this.edge[1], this.edge[2], this.edge[3])
		fill(114, 173, 124)
		//fill(0)
				rect(this.x + 10 * size, this.y, this.w - 10 * size, this.h - 10 * size, this.edge[0], this.edge[1], this.edge[2], this.edge[3])
		image(img[this.c + 6],this.x + 20 * size, this.y + 5, this.w -30 * size, this.h - 30 * size, this.edge[0], this.edge[1], this.edge[2], this.edge[3])
		fill(0,0,0,100)
		noStroke()
		triangle(this.x + this.edge[3] /2 + 20 * size, this.y + this.h - 1 * size - 21 * size, this.x + this.w - 10 * size, this.y + this.h - this.o[3] / 4- 60 * size, this.x + this.w - this.edge[2] / 3 - 10 * size, this.y + this.h - 22 * size)
		fill(255)
		stroke(0)
		text(onbt[this.c], this.x + this.w - textWidth(onbt[this.c]) - 20 * size, this.y + this.h - 28 * size)
		pop()
			if(this.pre == 1) {
			window.open(onbl[this.c])
			this.pre = 0;
		}
	}
	if(this.x < mouseX && this.x + this.w > mouseX && this.y < mouseY && this.y + this.h > mouseY) {
		this.hov = 1;
	}else{
		this.hov = 0;
	}
	if(this.b == 1 || this.b == 2 || this.b == 3 || this.b == 4) {
		if(this.hov == 1) {
			this.h -= ((this.h - this.o[3] - 20 * size)*delh) / 2
			this.edge[3] -= ((this.edge[3] - this.oe[3] - 8 * size)*delh) / 2
			this.edge[2] -= ((this.edge[2] - this.oe[2] - 8 * size)*delh) / 2
		}else{
			this.h -= ((this.h - this.o[3])*delh) / 2
			this.edge[3] -= ((this.edge[3] - this.oe[3])*delh) / 2
			this.edge[2] -= ((this.edge[2] - this.oe[2])*delh) / 2
		
		}
	}
	if(this.b == 5) {
		if(this.hov == 1) {
		this.w -= ((this.w - (ww /2 - 60 * size)) * delh) / 2
		this.x -= ((this.x - (ww /2 + 20 * size)) * delh) / 2
	}else{
		this.w -= ((this.w - ww/4 * size) * delh) / 2
		this.x -= ((this.x - this.oe[0]) * delh) / 2
	}
				   }
	if(this.edge[3] < 0.001) {
		this.edge[3] = 0
	}
if(this.edge[2] < 0.001) {
		this.edge[2] = 0
	}
	if(this.b == 6) {
		if(this.hov == 1) {
			this.x -= ((this.x - (this.oe[0] - (this.oe[2] / 10) * size)) * delh) / 2
			this.y -= ((this.y - (this.oe[1] - (this.oe[2] / 10) * size)) * delh) / 2
			this.w -= ((this.w - (this.oe[2] + (this.oe[2] / 5) * size)) * delh) / 2
			this.h -= ((this.h - (this.oe[3] + (this.oe[2] / 5) * size)) * delh) / 2
		}else{
			this.x -= ((this.x - this.oe[0]) * delh) / 2
			this.y -= ((this.y - this.oe[1]) * delh) / 2
			this.w -= ((this.w - this.oe[2]) * delh) / 2
			this.h -= ((this.h - this.oe[3]) * delh) / 2
		}
	}
	if(this.hov === 1 && mouseIsPressed) {
		if(this.oc == 1) {
			if(ml == 0) {
				this.pre = 1;
			}
			}else{
		this.pre = 1;
		}
	}else{
		this.pre = 0;
	}
}

function reshapewin(w,h) {
	sw = w;
	sh = h;
}

function reshapecan(w,h) {
resizeCanvas(w,h)
	ww = w;
	wh = h;
}

var start = 0;

function draw() {
			background(109, 168, 120);
	strokeWeight(1 * size)
	strokeJoin(ROUND)
	if (sfpsl <= 100) {
			calcFPS({
				count: 60
			})
			woweeee = closest(mhz, sfps)
			sfps = woweeee
			sfpsl += 1
		} else {
			if (woweeee === 0 === false) {
				sfps = woweeee
		}
		}
	frameRate(sfps)
	delh = deltaTime / 20;
				Ui()
	if(lp == 1) {
		loadpage()
	}
	if(mouseIsPressed) {
		ml = 1;
	}else{
		ml = 0;
	}
	if(windowHeight == sh == false || windowWidth == sw == false) {
		reshapewin(windowWidth,windowHeight)
	}
	textSize(20 * size)
	push()
stroke(0)
	strokeWeight(3)
	text("Website Designed By: Evan Bailey, Eli Ecker, and Brayden Daigneau", (ww - textWidth("Website Designed By: Evan Bailey, Eli Ecker, and Brayden Dagineau")) / 2, wh - 20 * size)
pop()
}
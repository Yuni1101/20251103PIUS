let objs = [];
let colors = ['#52489c', '#4062bb', '#59c3c3', '#ebebeb', '#f45b69', '#454545'];

// 選單相關變數
let menuX = -300; // 選單初始位置（隱藏在左側）
let targetMenuX = -300; // 選單目標位置
let menuItems = ['第一單元作品', '第一單元講義', '測驗系統', '回到首頁'];
let menuItemsUrls = {
		'第一單元作品': 'https://yuni1101.github.io/20251020/',
		'第一單元講義': 'https://hackmd.io/@-OiUZIdpTwSic0xa3D86SA/r1ObwX0jgg',
		'測驗系統': 'https://yuni1101.github.io/20251103--/',
		'回到首頁': ''
};
let iframe;

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	INIT();
}

// 全域 mouseClicked 回呼（放在外面，p5 能正確偵測）
function mouseClicked() {
	// 檢查是否點擊選單項目
	if (menuX > -290) {  // 當選單可見時
		for (let i = 0; i < menuItems.length; i++) {
			let menuItemY = 50 + i * 60;
			if (mouseX > menuX && mouseX < menuX + 280 &&
				mouseY > menuItemY && mouseY < menuItemY + 40) {

				// 取得點擊的項目
				let clickedItem = menuItems[i];
				let url = menuItemsUrls[clickedItem];

				// 如果有對應的 URL 就在 iframe 顯示它
				if (url) {
					iframe = document.getElementById('content-frame');
					iframe.src = url;
					iframe.style.display = 'block';
				} else if (clickedItem === '回到首頁') {
					// 隱藏 iframe
					iframe = document.getElementById('content-frame');
					iframe.style.display = 'none';
					iframe.src = '';
				}
			}
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	INIT();
}

function draw() {
	background('#F5C969');
	
	// 繪製背景動畫
	for (let i of objs) {
		i.show();
		i.move();
	}

	if (frameCount % 95 == 0) {
		INIT();
	}
	
	// 檢查滑鼠位置並更新選單目標位置
	if (mouseX < 100) {
		targetMenuX = 0;
	} else {
		targetMenuX = -300;
	}
	
	// 平滑移動選單
	menuX = lerp(menuX, targetMenuX, 0.1);
	
	// 繪製選單背景
	push();
	rectMode(CORNER);
	fill(0, 0, 0, 200);
	noStroke();
	rect(menuX, 0, 300, height);
	pop();
	
	// 繪製選單項目
	push();
	textSize(32);
	textAlign(LEFT, TOP);
	fill(255);
	for (let i = 0; i < menuItems.length; i++) {
		text(menuItems[i], menuX + 20, 50 + i * 60);
	}
	pop();
}

function INIT() {
	objs = [];
	let num1 = int(random(3, 7));
	let num2 = int(random(40, 80));
	for (let i = 0; i < num1; i++) {
		objs.push(new OMP());
	}

	for (let i = 0; i < num2; i++) {
		objs.push(new SBM(i / 8));
	}
}

function easeOutQuart(x) {
	return 1 - Math.pow(1 - x, 4);
}

function easeInQuart(x) {
	return x * x * x * x;
}

class SBM {
	constructor(t) {
		this.x0 = 0;
		this.y0 = 0;
		this.r = random(0.4) * width;
		let a = random(10);
		this.x1 = this.r * cos(a);
		this.y1 = this.r * sin(a);
		this.x = this.x0;
		this.y = this.y0;
		this.d0 = 0;
		this.d1 = random(5, 40);
		this.d = 0;
		this.t = -int(t);
		this.t1 = 40;
		this.t2 = this.t1 + 0;
		this.t3 = this.t2 + 40;
		this.rot1 = PI * random(0.5);
		this.rot = random(10);
		this.col = random(colors);
		this.rnd = int(random(3));
	}

	show() {
		push();
		translate(width / 2, height / 2);
		rotate(this.rot);
		if (this.rnd == 0) {
			fill(this.col);
			strokeWeight(0);
			circle(this.x, this.y, this.d);
		} else if (this.rnd == 1) {
			fill(this.col);
			strokeWeight(0);
			rect(this.x, this.y, this.d, this.d);
		}
		else if (this.rnd == 2) {
			noFill();
			stroke(this.col);
			strokeWeight(this.d * 0.3);
			line(this.x - this.d *0.45, this.y - this.d *0.45, this.x + this.d *0.45, this.y + this.d *0.45);
			line(this.x - this.d *0.45, this.y + this.d *0.45, this.x + this.d *0.45, this.y - this.d *0.45);
		}
		pop();
	}

	move() {
		if (0 < this.t && this.t < this.t1) {
			let n = norm(this.t, 0, this.t1 - 1);
			this.x = lerp(this.x0, this.x1, easeOutQuart(n));
			this.y = lerp(this.y0, this.y1, easeOutQuart(n));
			this.d = lerp(this.d0, this.d1, easeOutQuart(n));

		} else if (this.t2 < this.t && this.t < this.t3) {
			let n = norm(this.t, this.t2, this.t3 - 1);
			this.x = lerp(this.x1, this.x0, easeInQuart(n));
			this.y = lerp(this.y1, this.y0, easeInQuart(n));
			this.d = lerp(this.d1, this.d0, easeInQuart(n));
		}
		this.t++;
		this.rot += 0.005;
	}
}

class OMP {
	constructor() {
		this.x = width / 2;
		this.y = height / 2;
		this.d = 0;
		this.d1 = width * random(0.1, 0.9) * random();

		this.t = -int(random(20));
		this.t1 = 40;
		this.t2 = this.t1 + 40;
		this.sw = 0;
		this.sw1 = this.d1 * random(0.05);
		this.col = random(colors);
	}

	show() {
		noFill();
		stroke(this.col);
		strokeWeight(this.sw);
		circle(this.x, this.y, this.d);
	}

	move() {
		if (0 < this.t && this.t < this.t1) {
			let n = norm(this.t, 0, this.t1 - 1);
			this.d = lerp(0, this.d1, easeOutQuart(n));
			this.sw = lerp(0, this.sw1, easeOutQuart(n));
		} else if (this.t1 < this.t && this.t < this.t2) {
			let n = norm(this.t, this.t1, this.t2 - 1);
			this.d = lerp(this.d1, 0, easeInQuart(n));
			this.sw = lerp(this.sw1, 0, easeInQuart(n));
		}
		this.t++;
	}
}
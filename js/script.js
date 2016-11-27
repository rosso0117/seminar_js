onload = function () {
  draw();
}
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
var img;
function draw() {
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');

  var img = new Image();
  img.src = "img/img01.tiff";
  ctx.drawImage(img, 100, 100, 32, 32);
}

var x = 50;
var y = 50;
var w = 50;
var h = 50;

var self = {
  x: 50,
  y: 50,
  w: 50,
  h: 50
};

var enemy = {
  x : 150,
  y : 150,
  w : 50,
  h : 50
}

  // canvasの描写機能にアクセス
if (canvas.getContext) {
  var ctx = canvas.getContext('2d')
  // ctx.rect(self.x - self.w/2, self.y - self.h /2, self.w, self.h);
  ctx.rect(enemy.x - enemy.w/2, enemy.y - enemy.h /2, enemy.w, enemy.h);
  ctx.beginPath();
  ctx.fillStyle = 'rgb(155, 187, 89)';
  ctx.rect(0, 200, 400, 200);
  ctx.closePath();
  var img = new Image();
  img.src = "img/c.jpg";
  ctx.drawImage(img, self.x - self.w/2, self.y - self.h/2, self.w, self.h);
  ctx.fill()
}

document.body.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37:
      self.x -= 2;
      break;
    case 39:
      self.x += 2
      break;
    case 40:
      self.y += 2;
      break;
    case 38:
      self.y -= 2;
      break;
  }
  moveSelf(self.x, self.y, self.w, self.h);
}
setInterval(moveEnemy, 500);

function moveSelf(x, y, w, h) {
  ctx.clearRect(0, 0, 400, 200);
  // ctx.fillRect(x - w/2, y - h/2, w, h);
  ctx.fillRect(enemy.x - enemy.w/2, enemy.y - enemy.h /2, enemy.w, enemy.h);
  ctx.drawImage(img, x - w/2, y - h/2, w, h);
  isHit()
}

function moveEnemy() {
  var rnd = Math.round(Math.random());
  if (rnd == 0) {
    enemy.x -= 2;
  } else {
    enemy.x += 2;
  }
  console.log(rnd);
  ctx.clearRect(0, 0, 400, 200);
  // ctx.fillRect(self.x - self.w/2, self.y - self.h/2, self.w, self.h);
  ctx.drawImage(img, self.x - self.w/2, self.y - self.h/2, self.w, self.h);
  ctx.fillRect(enemy.x - enemy.w/2, enemy.y - enemy.h/2, enemy.w, enemy.h);
  isHit()
}

function isHit() {
  if (Math.abs(self.x - enemy.x) < self.w/2 + enemy.w/2
  && Math.abs(self.y - enemy.y) < self.h/2 + enemy.h/2
  ) {
    console.log("hit");
  }
}
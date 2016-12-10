'use strict';

class Character {
  constructor(ctx, img, x, y) {
    this.ctx = ctx;
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
  }

  // キャラ描写
  draw() {
    this.ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  }

  // 自分の周りをクリア（再描写のため)
  clear() {
    this.ctx.clearRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  }

  // Hit時
  isHit(target) {
    if (Math.abs(this.x - target.x) < this.w / 2 + target.w / 2 && Math.abs(this.y - target.y) < this.h / 2 + enemy.h / 2) {
      console.log("hit");
    }
  }
}

class Player extends Character {
  // キーに合わせて移動
  move(keycode) {
    this.clear();
    var direction = "";
    switch (keycode) {
      case 37:
        direction = "left";
        this.x -= 5;
        break;
      case 39:
        direction = "right";
        this.x += 5;
        break;
    }
    this.draw();
    this.ctx.fill();
  }
}

class Enemy extends Character {
  move() {
    this.clear();
    // var rnd = Math.round(Math.random());
    // if (rnd == 0) {
    this.x -= 2;
    // } else {
    // this.x += 2;
    // }
    this.draw();
    this.ctx.fill();
  }
}

onload = function () {
  init();
};

function init() {
  let canvas = document.getElementById('game');
  if (canvas.getContext) {
    let ctx = canvas.getContext('2d');
  }

  if (canvas.getContext) {
    // 地面
    ctx.beginPath();
    ctx.fillStyle = 'rgb(155, 187, 89)';
    ctx.rect(0, 300, 700, 200);
    ctx.closePath();

    // Player
    const img = new Image();
    img.src = "img/c.jpg";
    const player = new Player(ctx, img, 50, 300 - 60 / 2);
    player.draw();

    // Enemy
    const img2 = new Image();
    img2.src = "img/b.png";
    const enemy = new Enemy(ctx, img2, 650, 300 - 60 / 2);
    enemy.draw();

    ctx.fill();

    // 敵が一定間隔ごとに動く
    setInterval("tick(enemy)", "500");

    // キーボード押時
    document.body.onkeydown = function (e) {
      player.move(e.keyCode);
      player.isHit(enemy);
    };
  }
}

function tick(character) {
  character.move();
  character.isHit();
}
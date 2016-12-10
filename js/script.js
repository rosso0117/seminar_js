'use strict';

const stageW = 700;
const stageH = 500;
const charW = 50;
const charH = 50;
const charStartY = 300 - charH / 2;

class Character {
  constructor(ctx, img, x, y) {
    this.ctx = ctx;
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = charW;
    this.h = charH;
    this.isJump = false;
    this.isFall = false;
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
    if (Math.abs(this.x - target.x) < this.w / 2 + target.w / 2 && Math.abs(this.y - target.y) < this.h / 2 + target.h / 2) {
      console.log("hit");
      return true;
    }
  }
}

class Player extends Character {
  // キーに合わせて移動
  move(keycode) {
    this.clear();
    let direction = "";
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

  jump(keycode, onTop) {
    const top = charStartY - 80;

    if (this.y <= top) {
      onTop = true;
      this.isJump = false;
    }

    if (keycode != 32 || onTop || this.isFall) {
      return;
    }
    this.clear();
    this.y -= 4;
    this.isJump = true;
    this.draw();
    this.ctx.fill();

    setTimeout(() => {
      this.jump(keycode, onTop);
    }, 10);
  }

  fall(keycode, onGround) {
    const ground = charStartY;
    if (this.y >= ground) {
      onGround = true;
      this.isFall = false;
    }

    if (keycode != 32 || onGround) {
      return;
    }

    this.clear();
    this.y += 4;
    this.isFall = true;
    this.draw();
    this.ctx.fill();

    setTimeout(() => {
      this.fall(keycode, onGround);
    }, 10);
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

onload = () => {
  init();
};

var init = () => {
  const canvas = document.getElementById('game');
  let ctx;
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
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
    const player = new Player(ctx, img, 50, 300 - charH / 2);
    player.draw();

    // Enemy
    const img2 = new Image();
    img2.src = "img/b.png";

    let enemies = [];

    appendNewEnemy(enemies, ctx, img2);

    ctx.fill();

    // 敵が一定間隔ごとに動く
    setInterval(() => {
      tick(enemies, player);
    }, 1000);

    // キーボード押時
    document.body.onkeydown = e => {
      player.move(e.keyCode);
      player.jump(e.keyCode, false);
      enemies.forEach((enemy, index) => {
        player.isHit(enemy);
      });
    };

    document.body.onkeyup = e => {
      player.fall(e.keyCode, false);
    };
  }
};

var appendNewBlock = (blocks, ctx) => {};

var appendNewEnemy = (enemies, ctx, img) => {
  // ステージ1/3以降にランダムに作成
  const minX = stageW * 1 / 3;
  const rndX = Math.round(Math.random() * (stageW + 1 - minX)) + minX;

  const enemy = new Enemy(ctx, img, rndX, 300 - charH / 2);
  enemies.push(enemy);
  enemy.draw();

  setTimeout(() => {
    appendNewEnemy(enemies, ctx, img);
  }, 1000);
};

var tick = (enemies, player) => {
  enemies.forEach((enemy, index) => {
    enemy.move();
    const isHit = enemy.isHit(player);

    // 衝突したキャラクターを削除
    if (isHit) {
      enemies.splice(index, 1);
      enemy.clear(); // 跡が残るので消す
    }
  });
};
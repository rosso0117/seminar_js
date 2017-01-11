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
    this.isFall = false;
    this.bullets = [];
  }

  // キャラ描写
  draw() {
    this.ctx.drawImage(this.img, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
  }

  // 自分の周りをクリア（再描写のため)
  clear() {
    this.ctx.clearRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
  }

  // Hit時
  isHit(target) {
    if ( Math.abs(this.x - target.x) < this.w/2 + target.w/2
      && Math.abs(this.y - target.y) < this.h/2 + target.h/2
    ) {
      console.log("hit");
      return true;
    }
  }
}

class Player extends Character {
  // キーに合わせて移動
  move(keycode) {
    this.clear();
    switch (keycode) {
    case 37:
      this.x -= 5;
      break;
    case 39:
      this.x += 5;
      break;
    }
    this.draw();
    this.ctx.fill();
  }

  jump(keycode, onTop) {
    // ジャンプの最高到達点
    const top = charStartY - 80;

    if (this.y <= top) {
      onTop = true;
    }

    // 最高到達点より前にspaceキーを話せばその時点で落ちる(isFall)
    if (keycode != 32 || onTop || this.isFall) {
      return;
    }
    this.clear();
    this.y -= 4;
    this.draw();
    this.ctx.fill();

    setTimeout( () => { this.jump(keycode, onTop) }, 10 );
  }

  fall(keycode, onGround) {
    if (this.y >= charStartY) {
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

    setTimeout( () => { this.fall(keycode, onGround) }, 10 );
  }

  shot(keycode) {
    if (keycode != 83) {
      return;
    }

    const bullet = new Bullet(this.ctx, this.x, this.y);
    bullet.draw();
    this.bullets.push(bullet);
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

class Bullet {
  constructor(ctx, x, y, index) {
    this.ctx = ctx;
    this.x   = x;
    this.y   = y;
    this.w   = 5;
    this.h   = 5;
    this.index = index;
  }

  draw() {
    this.ctx.rect(this.x, this.y, this.w, this.h);
  }

  clear() {
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
  }

  move() {
    this.clear();
    this.x += 60;
    this.draw();
    this.ctx.fill();
  }

  isHit(enemies, player) {
    enemies.forEach( (enemy, index) => {
      if ( this.x > enemy.x ) {
        enemies.splice(index, 1);
        enemy.clear(); // 跡が残るので消す
        this.clear();
        player.bullets.splice(index, 1);
        this.ctx.fill();
      }
    });
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
    img.src = "img/c.jpg"
    const player = new Player(ctx, img, 50, charStartY);
    player.draw();

    // Enemy
    let enemies = [];
    const img2 = new Image();
    img2.src = "img/b.png"
    appendNewEnemy(enemies, ctx, img2);

    ctx.fill();

    // 敵が一定間隔ごとに動く
    setInterval( () => { tick(enemies, player) }, 1000 );

    // キーボード押時
    document.body.onkeydown = (e) => {
      player.move(e.keyCode);
      player.jump(e.keyCode, false);
      player.shot(e.keyCode);
      enemies.forEach( (enemy, index) => {
        player.isHit(enemy);
      } );
    }

    document.body.onkeyup = (e) => {
      player.fall(e.keyCode, false);
    }
  }
}

// var appendNewBlock = (blocks, ctx) => {
// }

var appendNewEnemy = (enemies, ctx, img) => {
  // ステージ1/3以降にランダムに作成
  const minX = stageW * 1/3
  const rndX = Math.round( Math.random() * (stageW + 1 - minX) ) + minX;

  const enemy = new Enemy(ctx, img, rndX, charStartY);
  enemies.push(enemy);
  enemy.draw();

  setTimeout( () => { appendNewEnemy(enemies, ctx, img) }, 1000 );
}

var tick = (enemies, player) => {
  enemies.forEach( (enemy, index) => {
    enemy.move();
    const isHit = enemy.isHit(player);

    // 衝突したキャラクターを削除
    if (isHit) {
      enemies.splice(index, 1);
      enemy.clear(); // 跡が残るので消す
      player.draw();
    }
  } );

  // 弾
  player.bullets.forEach( (bullet, index) => {
    bullet.move();
    bullet.isHit(enemies);
  } );
}

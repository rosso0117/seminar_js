'use strict';

const stageW = 700;
const stageH = 500;
const charW = 50;
const charH = 50;

class Character {
  constructor(ctx, img, x, y) {
    this.ctx = ctx;
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = charW;
    this.h = charH;
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
    if (Math.abs(this.x - target.x) < this.w/2 + target.w/2
      && Math.abs(this.y - target.y) < this.h/2 + target.h/2
    ) {
      console.log("hit");
    }
  }
}

class Player extends Character {
  // キーに合わせて移動
  move(keycode) {
    this.clear();
    let direction = ""
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
    const player = new Player(ctx, img, 50, 300 - charH/2);
    player.draw();

    // Enemy
    const img2 = new Image();
    img2.src = "img/b.png"

    let enemies = [];

    appendNewEnemy(enemies, ctx, img2);

    ctx.fill();

    // 敵が一定間隔ごとに動く
    setInterval( () =>{ tick(enemies, player) }, 500 );

    // キーボード押時
    document.body.onkeydown = (e) => {
      player.move(e.keyCode);
      enemies.forEach( (enemy, index) => {
        player.isHit(enemy);
      } );
    }
  }
}

var appendNewBlock = (blocks, ctx) => {
}

var appendNewEnemy = (enemies, ctx, img) => {
  // ステージ1/3以降にランダムに作成
  const minX = stageW * 1/3
  const rndX = Math.round(Math.random() * (stageW + 1 - minX)) + minX;

  const enemy = new Enemy(ctx, img, rndX, 300 - charH/2);
  enemies.push(enemy);
  enemy.draw();

  setTimeout( () => { appendNewEnemy(enemies, ctx, img) }, 1000 );
}

var tick = (characteres, target) => {
  characteres.forEach( (character, index) => {
    character.move();
    character.isHit(target);
  } );
}

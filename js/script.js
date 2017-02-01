'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stageW = 700;
var stageH = 500;
var charW = 50;
var charH = 50;
var charStartY = 300 - charH / 2;
var moveTick = "";
var score = 0;

var Character = function () {
  function Character(ctx, img, x, y) {
    _classCallCheck(this, Character);

    this.ctx = ctx;
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = charW;
    this.h = charH;
    this.jumpFlag = false;
    this.bullets = [];
  }

  // キャラ描写


  _createClass(Character, [{
    key: "draw",
    value: function draw() {
      this.ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    // 自分の周りをクリア（再描写のため)

  }, {
    key: "clear",
    value: function clear() {
      this.ctx.clearRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    // Hit時

  }, {
    key: "isHit",
    value: function isHit(target) {
      if (Math.abs(this.x - target.x) < this.w / 2 + target.w / 2 && Math.abs(this.y - target.y) < this.h / 2 + target.h / 2) {
        console.log("hit");
        return true;
      }
    }
  }]);

  return Character;
}();

var Player = function (_Character) {
  _inherits(Player, _Character);

  function Player() {
    _classCallCheck(this, Player);

    return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).apply(this, arguments));
  }

  _createClass(Player, [{
    key: "move",

    // キーに合わせて移動
    value: function move(keycode) {
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
  }, {
    key: "jump",
    value: function jump(keycode, onTop) {
      var _this2 = this;

      // ジャンプの最高到達点
      var top = charStartY - 80;

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

      setTimeout(function () {
        _this2.jump(keycode, onTop);
      }, 10);
    }
  }, {
    key: "fall",
    value: function fall(keycode, onGround) {
      var _this3 = this;

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

      setTimeout(function () {
        _this3.fall(keycode, onGround);
      }, 10);
    }
  }, {
    key: "shot",
    value: function shot(keycode) {
      if (keycode != 83) {
        return;
      }

      var bullet = new Bullet(this.ctx, this.x + this.w / 2, this.y);
      bullet.draw();
      this.bullets.push(bullet);
      document.getElementById('shoot').play();
      this.ctx.fill();
    }
  }]);

  return Player;
}(Character);

var Enemy = function (_Character2) {
  _inherits(Enemy, _Character2);

  function Enemy(ctx, img, x, y) {
    _classCallCheck(this, Enemy);

    var _this4 = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, ctx, img, x, y));

    _this4.moved = 0;
    _this4.movelimit = 100;
    _this4.direction = "left";
    return _this4;
  }

  _createClass(Enemy, [{
    key: "move",
    value: function move() {
      this.clear();

      if (this.moved == 0 || this.movelimit <= this.moved) {
        var rnd = Math.round(Math.random());
        if (rnd == 0) {
          this.direction = "left";
        } else {
          this.direction = "right";
        }
        this.moved = 0;
      }

      if (this.direction == "right") {
        this.x += 2;
      } else {
        this.x -= 2;
      }

      if (stageW <= this.x) {
        this.direction = "left";
      }

      if (this.x <= 0) {
        this.direction = "right";
      }

      this.moved += 2;
      this.draw();
      this.ctx.fill();
    }
  }]);

  return Enemy;
}(Character);

var Bullet = function () {
  function Bullet(ctx, x, y, index) {
    _classCallCheck(this, Bullet);

    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = 8;
    this.h = 8;
    this.index = index;
    this.moved = 0;
    this.movelimit = 100;
  }

  _createClass(Bullet, [{
    key: "draw",
    value: function draw() {
      this.ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.ctx.clearRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
  }, {
    key: "move",
    value: function move(bullets) {
      console.log(this.moved);
      if (this.movelimit <= this.moved) {
        this.clear;
        bullets.splice(this.index, 1);
        this.ctx.fill();
        return;
      }
      this.clear();
      this.x += 10;
      this.moved += 10;
      this.draw();
      this.ctx.fill();
    }
  }, {
    key: "isHit",
    value: function isHit(enemies, player) {
      var _this5 = this;

      enemies.forEach(function (enemy, index) {
        if (Math.abs(_this5.x - enemy.x) < _this5.w / 2 + enemy.w / 2 && Math.abs(_this5.y - enemy.y) < _this5.h / 2 + enemy.h / 2) {
          enemies.splice(index, 1);
          enemy.clear(); // 跡が残るので消す
          _this5.clear();
          player.bullets.splice(_this5.index, 1);
          _this5.ctx.fill();
          document.getElementById('bomb').play();
          score += 1;
          document.getElementById('score').innerHTML = score;
        }
      });
    }
  }]);

  return Bullet;
}();

onload = function onload() {
  init();
};

var init = function init() {
  var canvas = document.getElementById('game');
  var ctx = void 0;
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  }

  if (canvas.getContext) {
    (function () {
      // 地面
      ctx.beginPath();
      ctx.fillStyle = 'rgb(0, 102, 204)';
      ctx.rect(0, 300, 700, 200);
      ctx.closePath();

      // Player
      var img = new Image();
      img.src = "img/c.jpg";
      var player = new Player(ctx, img, 50, charStartY);
      player.draw();

      // Enemy
      var enemies = [];
      var img2 = new Image();
      img2.src = "img/b.png";
      appendNewEnemy(enemies, ctx, img2);

      ctx.fill();

      // 敵が一定間隔ごとに動く
      moveTick = setInterval(function () {
        tick(enemies, player);
      }, 100);

      // キーボード押時
      document.body.onkeydown = function (e) {
        player.move(e.keyCode);
        player.jump(e.keyCode, false);
        player.shot(e.keyCode);
        enemies.forEach(function (enemy, index) {
          player.isHit(enemy);
        });
      };

      document.body.onkeyup = function (e) {
        player.fall(e.keyCode, false);
      };
    })();
  }
};

var gameOver = function gameOver(ctx, moveTick) {
  console.log("GAME OVER");
  score = 0;
  document.getElementById('score').innerHTML = 0;
  clearInterval(moveTick);
  for (var i = 1; i < 1000; i++) {
    clearTimeout(i);
  }
  ctx.clearRect(0, 0, stageW, stageH);
  ctx.fill();
  init();
};

// var appendNewBlock = (blocks, ctx) => {
// }

var appendNewEnemy = function appendNewEnemy(enemies, ctx, img) {
  // ステージ1/3以降にランダムに作成
  var minX = stageW * 1 / 6;
  var rndX = Math.round(Math.random() * (stageW + 1 - minX)) + minX;

  var enemy = new Enemy(ctx, img, rndX, charStartY);
  enemies.push(enemy);
  enemy.draw();

  setTimeout(function () {
    appendNewEnemy(enemies, ctx, img);
  }, 5000);
};

var tick = function tick(enemies, player) {
  enemies.forEach(function (enemy, index) {
    enemy.move();
    var isHit = enemy.isHit(player);

    // 衝突したキャラクターを削除
    if (isHit) {
      gameOver(player.ctx, moveTick);
      // enemies.splice(index, 1);
      // enemy.clear(); // 跡が残るので消す
      // player.draw();
    }
  });

  // 弾
  player.bullets.forEach(function (bullet, index) {
    if (bullet.movelimit <= bullet.moved) {
      bullet.clear();
      player.bullets.splice(bullet.index, 1);
      bullet.ctx.fill();
    } else {
      bullet.move(player.bullets);
      bullet.isHit(enemies, player);
    }
  });
};
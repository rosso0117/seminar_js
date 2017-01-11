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

var Character = function () {
  function Character(ctx, img, x, y) {
    _classCallCheck(this, Character);

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


  _createClass(Character, [{
    key: 'draw',
    value: function draw() {
      this.ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    // 自分の周りをクリア（再描写のため)

  }, {
    key: 'clear',
    value: function clear() {
      this.ctx.clearRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    // Hit時

  }, {
    key: 'isHit',
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
    key: 'move',

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
    key: 'jump',
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
    key: 'fall',
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
    key: 'shot',
    value: function shot(keycode) {
      if (keycode != 83) {
        return;
      }

      var bullet = new Bullet(this.ctx, this.x, this.y);
      bullet.draw();
      this.bullets.push(bullet);
      this.ctx.fill();
    }
  }]);

  return Player;
}(Character);

var Enemy = function (_Character2) {
  _inherits(Enemy, _Character2);

  function Enemy() {
    _classCallCheck(this, Enemy);

    return _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).apply(this, arguments));
  }

  _createClass(Enemy, [{
    key: 'move',
    value: function move() {
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
  }]);

  return Enemy;
}(Character);

var Bullet = function () {
  function Bullet(ctx, x, y, index) {
    _classCallCheck(this, Bullet);

    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = 5;
    this.h = 5;
    this.index = index;
  }

  _createClass(Bullet, [{
    key: 'draw',
    value: function draw() {
      this.ctx.rect(this.x, this.y, this.w, this.h);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.ctx.clearRect(this.x, this.y, this.w, this.h);
    }
  }, {
    key: 'move',
    value: function move() {
      this.clear();
      this.x += 60;
      this.draw();
      this.ctx.fill();
    }
  }, {
    key: 'isHit',
    value: function isHit(enemies, player) {
      var _this5 = this;

      enemies.forEach(function (enemy, index) {
        if (_this5.x > enemy.x) {
          enemies.splice(index, 1);
          enemy.clear(); // 跡が残るので消す
          _this5.clear();
          player.bullets.splice(index, 1);
          _this5.ctx.fill();
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
      ctx.fillStyle = 'rgb(155, 187, 89)';
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
      setInterval(function () {
        tick(enemies, player);
      }, 1000);

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

// var appendNewBlock = (blocks, ctx) => {
// }

var appendNewEnemy = function appendNewEnemy(enemies, ctx, img) {
  // ステージ1/3以降にランダムに作成
  var minX = stageW * 1 / 3;
  var rndX = Math.round(Math.random() * (stageW + 1 - minX)) + minX;

  var enemy = new Enemy(ctx, img, rndX, charStartY);
  enemies.push(enemy);
  enemy.draw();

  setTimeout(function () {
    appendNewEnemy(enemies, ctx, img);
  }, 1000);
};

var tick = function tick(enemies, player) {
  enemies.forEach(function (enemy, index) {
    enemy.move();
    var isHit = enemy.isHit(player);

    // 衝突したキャラクターを削除
    if (isHit) {
      enemies.splice(index, 1);
      enemy.clear(); // 跡が残るので消す
      player.draw();
    }
  });

  // 弾
  player.bullets.forEach(function (bullet, index) {
    bullet.move();
    bullet.isHit(enemies);
  });
};
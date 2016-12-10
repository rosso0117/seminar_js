## キャラクター
```js
  var Player = (function() {
    var ctx;
    var imgsrc = "";
    var x;
    var y;
    var w; // キャラクターの幅1
    var h; // キャラクターの高さ

    // initialize
    var Player = function(ctx, img, x, y) {
      this.ctx = ctx;
      this.img = img;
      this.x = x;
      this.y = y;
      this.w = 60; // キャラクターの幅
      this.h = 60; // キャラクターの高さ
    };

    var p = Player.prototype;

    // キャラ描写
    p.draw = function() {
      // 描写の軸を画像の中心にする
      this.ctx.drawImage(this.img, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    };

    // 自分の周りをクリア（再描写のため)
    p.clear = function() {
      this.ctx.clearRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    };

    p.move = function(keycode) {
      this.clear();
      var direction = ""
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
    };

    // Hit時
    p.isHit = function(enemy) {
      if (Math.abs(this.x - enemy.x) < this.w/2 + enemy.w/2
        && Math.abs(this.y - enemy.y) < this.h/2 + enemy.h/2
      ) {
        console.log("hit");
      }
    };

    return Player;
  })();
```
```js
  var img = new Image();
  img.src = "img/c.jpg"
  var player = new Player(ctx, img, 50, 300 - 60/2);
  player.draw();

  // Enemy
  var img2 = new Image();
  img2.src = "img/b.png"
  var enemy = new Enemy(ctx, img2, 650, 300 - 60/2);
  enemy.draw();
```

## 座標
- X: canvasの左端からの座標
- Y: canvasの上端からの座標
- W: Xからの横幅
- H: Yからの高さ

## 描写
```js
  p.draw = function() {
    this.ctx.drawImage(this.img, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
  };
```

## クリア
```js
  p.clear = function() {
    // プレイヤーのエリアだけをクリア
    this.ctx.clearRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
   };
```
## 移動
```js
  document.body.onkeydown = function(e) {
    // 引数(e)から押したキーのコードが取れる
    player.move(e.keyCode);
  }

  #############
  KeyboardEvent
  code:
    "ArrowRight"
  key:
    "ArrowRight"
  keyCode:
    39
  #############

  // Playerオブジェクトのメソッド
  p.move = function(keycode) {
      // 跡が残らないように前のPlayerをクリア
      this.clear();
      var direction = ""
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
      // 再描写
      this.draw();
      this.ctx.fill();
    };
```

## 当たり判定

絶対値(プレイヤーのX座標 - 敵のX座標) < プレイヤーの幅 / 2 + 敵の幅 / 2<br>
かつ<br>
絶対値(プレイヤーのY座標 - 敵のY座標) < プレイヤーの高さ / 2 + 敵の高さ / 2

```js
  p.isHit = function(enemy) {
    if (Math.abs(this.x - enemy.x) < this.w/2 + enemy.w/2
      && Math.abs(this.y - enemy.y) < this.h/2 + enemy.h/2
    ) {
      console.log("hit");
    }
  };
```

## 処理の繰り返し
```js
  setInterval(tick, 500);

  function tick() {
    enemy.move();
  }
```
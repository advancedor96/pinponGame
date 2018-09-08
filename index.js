/* eslint-env jquery */
var GameObject = function (position, size, el) {
  console.log('執行 Game Object 建構子')
  this.position = position
  this.size = size
  this.$el = $(el)
  this.updateCss()
}

GameObject.prototype.updateCss = function () {
  // console.log('執行 updateCSs')
  this.$el.css('left', this.position.x + 'px')
  this.$el.css('top', this.position.y + 'px')
  this.$el.css('width', this.size.width + 'px')
  this.$el.css('height', this.size.height + 'px')
}
GameObject.prototype.isCollide = function (otherObject) {
  let inXrange = (this.position.x <= otherObject.position.x + otherObject.size.width) && (otherObject.position.x <= this.position.x + this.size.width)
  let inYrange = (this.position.y <= otherObject.position.y + otherObject.size.height) && (otherObject.position.y <= this.position.y + this.size.height)
  return inXrange && inYrange
}

// 建立 Ball 類別
var Ball = function () {
  let position = { x: 255, y: 255 }
  let size = { width: 15, height: 15 }
  this.velocity = { x: -5, y: 5 }
  GameObject.call(this, position, size, '.ball')
}
Ball.prototype = Object.create(GameObject.prototype)
Ball.prototype.constructor = Ball.constructor

// 建立 board 類別
var Board = function (position, selector) {
  this.position = position
  let size = { width: 100, height: 15 }
  this.velocity = { x: 0, y: 0 }
  GameObject.call(this, position, size, selector)
}
Board.prototype = Object.create(GameObject.prototype)
Board.prototype.constructor = Board.constructor
Board.prototype.update = function () {

}
var b1 = new Board({ x: 0, y: 30 }, '.b1')
var b2 = new Board({ x: 0, y: 450 }, '.b2')

Ball.prototype.update = function () {
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // 遇到邊界時反彈
  if (this.position.x <= 0 || this.position.x + this.size.width >= 500) {
    this.velocity.x = -this.velocity.x
  }
  if (this.position.y <= 0 || this.position.y + this.size.height >= 500) {
    this.velocity.y = -this.velocity.y
  }
  // 撞到其他物體
  if (this.isCollide(b1)) {
    console.log('撞到 b1 啦')
    this.velocity.y = this.velocity.y * (-2)
  }
  if (this.isCollide(b2)) {
    console.log('撞到 b2 啦')
    this.velocity.y = this.velocity.y * (-2)
  }
  this.updateCss()
}

var ball = new Ball()

Board.prototype.update = function () {
  // 遇到右邊牆壁
  if (this.position.x + this.size.width >= 500) {
    this.position.x = 500 - this.size.width
  }
  // 遇到左邊牆壁
  if (this.position.x <= 0) {
    this.position.x = 0
  }

  if (this.position.x + this.size.width / 2 < ball.position.x) {
    this.velocity.x = 5
  }
  if (ball.position.x < this.position.x) {
    this.velocity.x = -5
  }
  this.position.x += this.velocity.x
  this.updateCss()
}

var Game = function () {
  this.control = {}
  this.timer = null
  this.grade = 0
}
Game.prototype.startGame = function () {
  let time = 3
  let that = this
  $('.infoBtn').hide()
  $('.infoText').text('Ready')
  this.timer = setInterval(function () {
    $('.infoText').text(time)
    time--
    if (time < 0) {
      $('.info').hide()
      console.log('go')
      clearInterval(that.timer)
      that.startGameMain()
    }
  }, 1000)
}
Game.prototype.initControl = function () {
  let that = this
  $(window).keydown(function (e) {
    if (e.key === 'ArrowLeft') {
      that.control[e.key] = true
    }
    if (e.key === 'ArrowRight') {
      that.control[e.key] = true
    }
  })
  $(window).keyup(function (e) {
    if (e.key === 'ArrowLeft') {
      that.control[e.key] = false
    }
    if (e.key === 'ArrowRight') {
      that.control[e.key] = false
    }
  })
}
Game.prototype.endGame = function (txt) {
  $('.info').show()
  $('.infoText').text(txt)
  $('.infoBtn').show()
  clearInterval(this.timer)
}
Game.prototype.startGameMain = function () {
  let that = this
  this.timer = setInterval(function () {
    if (that.control['ArrowRight'] === true) {
      b2.position.x += 5
    }
    if (that.control['ArrowLeft'] === true) {
      b2.position.x -= 5
    }
    // 遇到右邊牆壁
    if (b2.position.x + b2.size.width >= 500) {
      b2.position.x = 500 - b2.size.width
    }
    // 遇到左邊牆壁
    if (b2.position.x <= 0) {
      b2.position.x = 0
    }

    if (ball.position.y + ball.size.height >= 500) {
      console.log('end')
      that.endGame('You lose')
    }
    if (ball.position.y <= 0) {
      that.endGame('Win')
    }
    ball.update()
    b1.update()
    b2.update()
  }, 30)
}

b2.update = function () {
  this.updateCss()
}

let g = new Game()
g.initControl()
$('.infoBtn').click(function () {
  g.startGame()
})

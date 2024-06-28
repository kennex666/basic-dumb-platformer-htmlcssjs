
const PlayerState = {
    IDLE: 'IDLE',
    WALKING: 'WALKING',
    JUMPING: 'JUMPING',
    FALLING: 'FALLING',
    RUNNING: 'RUNNING',
}

const PlayerMoveDirection = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
}

class Player {
  width = 85.3333;
  height = 104;
  sizePicture = "256px 208px";
  state = PlayerState.IDLE;
  speed = 5;
  currentFrame = 0;
    player = null;

  x = 0;
  y = 0;

  init = function () {
    this.player = document.getElementById("player");
    this.player.style.position = "absolute";
    this.player.style.left = "0px";
    this.player.style.top = "0px";
    this.player.style.width = this.width + "px";
    this.player.style.height = this.height + "px";
    this.player.style.backgroundImage =
      "url('/assets/img/character-myself.png')";
    this.player.style.backgroundPositionX = "0px";
    this.player.style.backgroundPositionY = "0px";
    this.player.style.backgroundRepeat = "no-repeat";
    this.player.style.backgroundSize = this.sizePicture;
      
    return this;
  };

  animateMoveRight = function () {
    if (this.state === PlayerState.IDLE) {
      this.state = PlayerState.WALKING;
      var interValID = setInterval(() => {
        if (this.state != PlayerState.WALKING) {
          clearInterval(interValID);
          return;
        }
        this.currentFrame++;
        if (this.currentFrame > 2) {
          this.currentFrame = 0;
        }
        this.player.style.backgroundPositionX =
          -(this.currentFrame * this.width) + "px";
      }, 100);
    }
  };

  animateRunRight = function () {
    if (this.state !== PlayerState.RUNNING) {
      this.state = PlayerState.RUNNING;
      var interValID = setInterval(() => {
        if (this.state !== PlayerState.RUNNING) {
          clearInterval(interValID);
          return;
        }
        this.currentFrame++;
        
        if (this.currentFrame > 5) {
            this.currentFrame = 0;
            this.player.style.backgroundPositionY = "0px";
        }
        if (this.currentFrame > 2) {
            this.player.style.backgroundPositionY = "-108px";
        }
        this.player.style.backgroundPositionX =
          -(this.currentFrame % 3 * this.width) + "px";
          
      }, 120);
    }
  };

  moveToRight = function ( upspeed = 0) {
    this.x += this.speed + upspeed;
    this.player.style.left = this.x + "px";
  };
  

  move = function (direction) {
    switch (direction) {
      case PlayerMoveDirection.LEFT:
        break;
      case PlayerMoveDirection.RIGHT:
        if (this.state != PlayerState.WALKING) this.animateMoveRight();
        this.moveToRight();
        break;
      case PlayerMoveDirection.UP:
        console.log("Moving up");
        break;
      case PlayerMoveDirection.DOWN:
        break;
    }
  };

  run = function (direction) {
    switch (direction) {
      case PlayerMoveDirection.LEFT:
        break;
      case PlayerMoveDirection.RIGHT:
        if (this.state != PlayerState.RUNNING) {
          this.animateRunRight();
        }
        this.moveToRight(2);
        break;
      case PlayerMoveDirection.UP:
        console.log("Moving up");
        break;
      case PlayerMoveDirection.DOWN:
        break;
    }
  };

  stopMove = function () {
    this.state = PlayerState.IDLE;
      this.player.style.backgroundPositionX = "0px";
        this.player.style.backgroundPositionY = "0px";
    this.currentFrame = 0;
  };

  constructor() {}
}

const player = new Player();

const keyEnum = { ArrowRight: 0, ArrowLeft: 1, ArrowUp: 2, ArrowDown: 3 }
const keyIsHold = new Array(4).fill(false);

var gravity = 7;
const Gravity = {
    run: (obj) => {
        const map = document.getElementById("map");
        const gravityID = setInterval(() => { 
            // clone obj
            var test = Object.assign({}, obj);
            test.y += gravity;
            test.player.style.top = test.y + "px";
            if (checkCollision(test, map)) {
             // clearInterval(gravityID);
              test.player.style.transition = "ease-in-out 0.01s";
            } else {
                obj.y += gravity;
                obj.player.style.top = obj.y + "px";
            }
        },1000/60)
    }
}

function checkCollision(character, obstacle) {
    if (
        character.x + character.player.offsetWidth >= obstacle.offsetLeft &&
        character.x <= obstacle.offsetLeft + obstacle.offsetWidth &&
        character.y + character.player.offsetHeight >= obstacle.offsetTop &&
        character.y <= obstacle.offsetTop + obstacle.offsetHeight
    ) {
        return true;
    } else {
        return false;
    }
}
window.onload = function () { 
    player.init();
    Gravity.run(player);
}

window.addEventListener('keydown', function (e) {
    if (e.key == "ArrowRight") {
        if (keyIsHold[keyEnum.ArrowRight] == true) { 
            player.run(PlayerMoveDirection.RIGHT)
            return;
        }
        keyIsHold[keyEnum.ArrowRight] = true;
        player.move(PlayerMoveDirection.RIGHT)
    }
    console.log(e.key)
})


window.addEventListener('keyup', function (e) { 
    if (e.key == "ArrowRight") {
        keyIsHold[keyEnum.ArrowRight] = false;

        player.stopMove();
     }
})
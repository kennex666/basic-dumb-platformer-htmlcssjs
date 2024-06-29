const player = new Player();

const keyEnum = { ArrowRight: 0, ArrowLeft: 1, ArrowUp: 2, ArrowDown: 3 }

const keyIsHold = new Array(4).fill(false);

const GameState = {
  autoMoving: false,
}

var gravity = 7;

const Gravity = {
    run: (obj) => {
        const map = document.getElementById("map");
        const gravityID = setInterval(() => { 
            // clone obj
            obj.location.y += gravity;
            obj.player.style.top = obj.location.y + "px";
            
            if (checkCollision(obj.player, map)) {
              obj.tempState = PlayerState.IDLE;
              if (obj.state === PlayerState.FALLING)
                obj.state = PlayerState.IDLE;
              clearInterval(gravityID);
            }
        },1000/60)
    }
}

function checkCollision(object1, object2) {
  if (
    object1.offsetLeft + object1.offsetWidth >= object2.offsetLeft &&
    object1.offsetLeft <= object2.offsetLeft + object2.offsetWidth &&
    object1.offsetTop + object1.offsetHeight >= object2.offsetTop &&
    object1.offsetTop <= object2.offsetTop + object2.offsetHeight
  ) {
    return true;
  } else {
    return false;
  }
}

window.addEventListener('keydown', function (e) {
  switch (e.key) {
    case "ArrowRight":
      if (keyIsHold[keyEnum.ArrowRight] == true) {
        player.run(PlayerMoveDirection.RIGHT);
      } else {
        keyIsHold[keyEnum.ArrowRight] = true;
        player.move(PlayerMoveDirection.RIGHT);
      }
      
      break;
    case "ArrowLeft":
      if (keyIsHold[keyEnum.ArrowLeft] == true) {
        player.run(PlayerMoveDirection.LEFT);
      } else {
        keyIsHold[keyEnum.ArrowLeft] = true;
        player.move(PlayerMoveDirection.LEFT);
      }
      break;
  }
})

window.addEventListener('keyup', function (e) { 
  let interValID = null;
  switch (e.key) {
    case "ArrowRight":
      keyIsHold[keyEnum.ArrowRight] = false;
      this.setTimeout(() => {
        player.stopMove();
      }, 1000/6);
      break;
    case "ArrowLeft":
      keyIsHold[keyEnum.ArrowLeft] = false;
      this.setTimeout(() => {
        player.stopMove();
      }, 1000/6);
      break;
    case "ArrowUp":

      if (player.state === PlayerState.RUNNING && player.tempState === PlayerState.IDLE && !GameState.autoMoving) {
        GameState.autoMoving = true;

        interValID = setInterval(() => {
          if (player.state !== PlayerState.RUNNING) {
            GameState.autoMoving = false;
            clearInterval(interValID);
            return;
          }
          if (keyIsHold[keyEnum.ArrowLeft] == true) {
            player.run(PlayerMoveDirection.LEFT);
          } else if (keyIsHold[keyEnum.ArrowRight] == true) {
            player.run(PlayerMoveDirection.RIGHT);
          }
        }, 30);

      }

      player.jump();
        break;

  }
})



window.onload = function () { 
    player.init();
  Gravity.run(player);
}
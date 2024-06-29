const PlayerState = {
    IDLE: 0,
    WALKING: 1,
    RUNNING: 2,
    JUMPING: 3,
    FALLING: 4,
};

const PlayerMoveDirection = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
};

class Player {
    pictureSize = {
        width: 256,
        height: 208,
    }

    width = this.pictureSize.width / 3;
    height = this.pictureSize.height / 2;

    state = PlayerState.IDLE;
    tempState = PlayerState.IDLE;

    speed = {
        WALKING: 7,
        RUNNING: 10,
    }

    jumpHeight = 500;

    currentFrame = 0;
    
    player = null; // DOM object

    location = {
        x: 0,
        y: 0,
    };

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
        this.player.style.backgroundSize = `${this.pictureSize.width}px ${this.pictureSize.height}px`;
        
        this.state = PlayerState.FALLING;

        return this;
    };

    animateMove = function (direction) {

        if (this.state === PlayerState.IDLE) {
            this.state = PlayerState.WALKING;
            if (direction == PlayerMoveDirection.LEFT) { 
                this.player.style.transform = "scaleX(-1)";
            } else if (direction == PlayerMoveDirection.RIGHT){
                this.player.style.transform = "scaleX(1)";
            }
        
            var interValID = setInterval(() => {
                if (this.state != PlayerState.WALKING) {
                    clearInterval(interValID);
                    return;
                }
                this.currentFrame++;
                if (this.currentFrame > 2) {
                  this.currentFrame = 0;
                }

                let frameX = (this.currentFrame % 3) * this.width;
                this.player.style.backgroundPositionX = `-${frameX}px`;
                
                // console.log(`frameX: ${frameX} currentFrame: ${this.currentFrame} direction: ${direction}`);

            }, 1000/4);
        }
    };

    animateRun = function (direction) {
        if (this.state !== PlayerState.RUNNING) {
            this.state = PlayerState.RUNNING;
            
            if (direction == PlayerMoveDirection.LEFT) {
                this.player.style.transform = "scaleX(-1)";
            } else if (direction == PlayerMoveDirection.RIGHT) {
                this.player.style.transform = "scaleX(1)";
            }

            
            var interValID = setInterval(() => {

                if (this.state !== PlayerState.RUNNING) {
                    clearInterval(interValID);
                    return;
                }

                this.currentFrame++;

                if (this.currentFrame == 3) {
                    this.player.style.backgroundPositionY = `${-this.height}px`;
                } else if (this.currentFrame > 5) {
                    this.currentFrame = 0;
                    this.player.style.backgroundPositionY = "0px";
                }
                
                let frameX = (this.currentFrame % 3) * this.width;
                this.player.style.backgroundPositionX = `-${frameX}px`;
                
                // console.log(`frameX: ${frameX} currentFrame: ${this.currentFrame} direction: ${direction}`);
            }, 1000/6);
        }
    };

    jump = function () {
        // Disable jump if player is already jumping or falling
        if (this.checkJumpingOrFailling())
            return;

        this.tempState = PlayerState.JUMPING;
        const jumping = setInterval(() => { 
            this.moveObject(0, -this.jumpHeight/300);
        }, 300/this.jumpHeight);


        setTimeout(() => {
            this.tempState = PlayerState.FALLING;
            Gravity.run(this);
            clearInterval(jumping);
        }, 350);

    }

    moveObject = function (x, y) {
        if (x != 0) {
            this.location.x += x;
            this.player.style.left = `${this.location.x}px`;
        }
        if (y != 0) {
            this.location.y += y;
            this.player.style.top = `${this.location.y}px`;
        }

    };

    move = function (direction) {
        
        // Disable jump if player is already jumping or falling
        if (this.checkJumpingOrFailling())
            return false;

        this.animateMove(direction);
        switch (direction) {
            case PlayerMoveDirection.LEFT:
                if (this.state === PlayerState.WALKING)
                this.moveObject(-this.speed.WALKING, 0);
                break;
            case PlayerMoveDirection.RIGHT:
                if (this.state === PlayerState.WALKING)
                    this.moveObject(this.speed.WALKING, 0);
                break;
            case PlayerMoveDirection.UP:
            case PlayerMoveDirection.DOWN:
                break;
        }
        return true;
    };

    run = function (direction) {
        // Disable jump if player is already falling
        if (this.checkJumpingOrFailling() && !this.checkRunWhileJumping())
            return false;

        this.animateRun(direction);
        
        switch (direction) {
            case PlayerMoveDirection.LEFT:
                if (this.state === PlayerState.RUNNING)
                this.moveObject(-this.speed.RUNNING, 0);
                break;
            case PlayerMoveDirection.RIGHT:
                if (this.state === PlayerState.RUNNING)
                    this.moveObject(this.speed.RUNNING, 0);
                break;
            case PlayerMoveDirection.UP:
            case PlayerMoveDirection.DOWN:
                break;
        }
        return true;
    };

    stopMove = function () {
        if (this.state !== PlayerState.WALKING && this.state !== PlayerState.RUNNING)
            return;
        this.state = PlayerState.IDLE;
        this.player.style.backgroundPositionX = "0px";
        this.player.style.backgroundPositionY = "0px";
        this.currentFrame = 0;
    };

    checkFailling = function () {
        return this.state === PlayerState.FALLING;
    }

    checkJumpingOrFailling = function () {
        return this.tempState === PlayerState.JUMPING || this.state === PlayerState.FALLING;
    }

    checkRunWhileJumping = function () {
        return this.tempState === PlayerState.JUMPING && this.state === PlayerState.RUNNING;
    }

    constructor() {}
}

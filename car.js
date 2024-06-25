import { Controls } from "./controls.js";
export class Car{
    constructor(x,y,width,height,color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 5;
        this.friction = 0.05;

        this.angle = 0;

        this.controls = new Controls();
    }

    update(){
        this.#move();
    }

    #move(){
        if(this.controls.up){
            this.speed += this.acceleration;
        }
        if(this.controls.down){
            this.speed -= this.acceleration;
        }

        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        // if speed is 0, don't update the angle
        if(this.speed != 0){
            if(this.controls.left){
                this.angle += 0.03;
            }
            if(this.controls.right){
                this.angle -= 0.03;
            }
        }

        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(
            - this.width/2,
            - this.height/2,
            this.width,
            this.height);

        // 速度为正时，车头标注红色
        if(this.speed > 0){
            ctx.fillStyle = 'red';
            ctx.fillRect(-this.width/2, -this.height/2,this.width, 2);
        }

        // 速度为负时，车尾标注蓝色
        if(this.speed < 0){
            ctx.fillStyle = 'blue';
            ctx.fillRect(-this.width/2, this.height/2 - 2,this.width, 2);
        }

        // // 标注车速
        // ctx.fillStyle = 'black';
        // ctx.font = '20px Arial';
        // ctx.fillText(`Speed: ${this.speed.toFixed(2)}`, -this.width/2, -this.height/2 - 10);




        ctx.restore();
    }
}
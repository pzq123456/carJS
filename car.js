import { Controls } from "./controls.js";
import { Sensor } from "./sensor.js";
import { polysIntersect } from "./utils.js";

export class Car{
    constructor(x,y,width,height,color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 10;
        this.friction = 0.05;

        this.angle = 0;

        this.sensors = new Sensor(this);
        this.controls = new Controls();
        this.polygon = this.#createPolygon();
    }

    update(roadBorders){
        this.#move();
        this.polygon = this.#createPolygon();
        this.damaged = this.#assessDamage(roadBorders);
        this.sensors.update(roadBorders);
    }

    #assessDamage(roadBorders){
        for(let i = 0; i < roadBorders.length; i++){
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });


        return points;
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
                this.angle += 0.01;
            }
            if(this.controls.right){
                this.angle -= 0.01;
            }
        }

        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }

    draw(ctx){

        if(this.damaged){
            ctx.fillStyle = 'gray';
        }else{
            ctx.fillStyle = this.color;
        }

        // use the polygon to draw the car

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.closePath();
        ctx.fill();
        
        // 速度为正时，车头标注红色
        if(this.speed > 0){

            ctx.strokeStyle = 'rgba(255,0,0,0.5)';
            ctx.beginPath();
            ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
            ctx.lineTo(this.polygon[1].x, this.polygon[1].y);
            ctx.stroke();
        }

        // 速度为负时，车尾标注蓝色
        if(this.speed < 0){
            ctx.strokeStyle = 'rgba(0,0,255,0.5)';
            ctx.beginPath();
            ctx.moveTo(this.polygon[2].x, this.polygon[2].y);
            ctx.lineTo(this.polygon[3].x, this.polygon[3].y);
            ctx.stroke();
        }

        // Debug: 标注车速 及 位置 及 角度
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`    Speed: ${this.speed.toFixed(2)}`, this.x, this.y);
        ctx.fillText(`    Position: (${this.x.toFixed(2)}, ${this.y.toFixed(2)})`, this.x, this.y + 20);
        ctx.fillText(`    Angle: ${this.angle.toFixed(2)}`, this.x, this.y + 40);
        if(this.damaged){
            ctx.fillStyle = 'red';
            ctx.font = '20px Arial';
            ctx.fillText(`    Damaged`, this.x, this.y + 60);
        }

        // draw sensors
        this.sensors.draw(ctx);

    }
}
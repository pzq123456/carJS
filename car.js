import { Controls } from "./controls.js";
import { Sensor } from "./sensor.js";
import { polysIntersect } from "./utils.js";

export class Car{
    constructor(x,y,width,height,controlType,maxSpeed = 10){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        if(controlType == "KEYS"){
            this.color = 'black';
        }else{
            this.color = 'darkgray';
        }

        this.speed = 0;
        this.acceleration = 0.1;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        this.angle = 0;

        if(controlType !== "DUMMY"){
            this.sensors = new Sensor(this);
        }
        this.controls = new Controls(controlType );
        this.polygon = this.#createPolygon();
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders,traffic);
            this.speed = this.damaged ? 0 : this.speed;
        }
        if(this.sensors){
            this.sensors.update(roadBorders,traffic);
        }
    } 

    #assessDamage(roadBorders,traffic){
        for(let i = 0; i < roadBorders.length; i++){
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        for(let i = 0; i < traffic.length; i++){
            if(polysIntersect(this.polygon, traffic[i].polygon)){
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
            if(this.controls.nitro){
                this.speed = this.speed < this.maxSpeed ? this.speed + this.acceleration * 2 : this.speed;
            }else{
                this.speed = this.speed < this.maxSpeed ? this.speed + this.acceleration : this.speed;
            }
        }
        if(this.controls.down){
            // 倒车时不支持 nitro 氮气加速
            this.speed = this.speed > -this.maxSpeed ? this.speed - this.acceleration : this.speed;
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
            // 红色描边
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
            for(let i = 1; i < this.polygon.length; i++){
                ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
            }
            ctx.closePath();
            ctx.stroke();

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

        if(this.controls.nitro){
            ctx.fillStyle = 'red';
            ctx.font = '20px Arial';
            ctx.fillText('NITRO', this.x + 20, this.y + 60);
            // 车尾 添加 表示速度的线条 速度越快，线条越长
            ctx.strokeStyle = 'rgba(0,255,255,0.5)';
            ctx.beginPath();
            ctx.moveTo(this.polygon[2].x, this.polygon[2].y);
            ctx.lineTo(this.polygon[2].x + this.speed * 10 * Math.sin(this.angle), this.polygon[2].y + this.speed * 10 * Math.cos(this.angle));
            ctx.stroke();
            // 反向延长
            ctx.beginPath();
            ctx.moveTo(this.polygon[3].x, this.polygon[3].y);
            ctx.lineTo(this.polygon[3].x + this.speed * 10 * Math.sin(this.angle), this.polygon[3].y + this.speed * 10 * Math.cos(this.angle));
            ctx.stroke();



        }

        // Debug: 标注车速 及 位置 及 角度
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Speed: ${this.speed.toFixed(2)}`, this.x + 20, this.y);
        ctx.fillText(`Position: (${this.x.toFixed(2)}, ${this.y.toFixed(2)})`, this.x + 20, this.y + 20);
        ctx.fillText(`Angle: ${this.angle.toFixed(2)}`, this.x + 20, this.y + 40);
        if(this.damaged){
            ctx.fillStyle = 'red';
            ctx.font = '20px Arial';
            ctx.fillText(`Damaged`, this.x + 20, this.y + 60);
        }

        // draw sensors
        // this.sensors.draw(ctx);
        if(this.sensors){
            this.sensors.draw(ctx);
        }

    }
}
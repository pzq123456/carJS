import { Controls } from "./controls.js";
import { Sensor } from "./sensor.js";
import { polysIntersect } from "./utils.js";
import { NerualNetwork } from "./network.js";

export class Car{
    constructor(x,y,width,height,controlType,maxSpeed = 15){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        if(controlType == "KEYS"){
            this.color = 'black';
        }else if(controlType == "AI"){
            this.color = 'forestgreen';
        }else{
            this.color = 'darkgray';
        }

        this.speed = 0;
        this.acceleration = 0.1;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        this.angle = 0;

        this.useBrain = controlType == "AI";

        if(controlType !== "DUMMY"){
            this.sensors = new Sensor(this);
            this.brain = new NerualNetwork(
                [this.sensors.rayCount,12,8,5]
            );
        }
        this.controls = new Controls(controlType); 
        this.polygon = this.#createPolygon();
 
        this.tailPoints = this.tailPoints || [];
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
            const offset = this.sensors.readings.map(
                r => r==null ? 0 : 1 - r.offset
            );
            const output = NerualNetwork.feedForward(offset, this.brain);
            // console.log(output);

            if(this.useBrain){
                this.controls.up = output[0];
                this.controls.left = output[1];
                this.controls.right = output[2];
                this.controls.down = output[3];
                this.controls.nitro = output[4];
            }
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
                this.speed = this.speed < this.maxSpeed ? this.speed + this.acceleration * Math.random() * 30 : this.speed;
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
                this.angle += 0.03;
            }
            if(this.controls.right){
                this.angle -= 0.03;
            }
        }

        // 方向自动回正
        if(this.speed > 0){
            if(this.angle > 0){
                this.angle -= 0.01;
            }
            if(this.angle < 0){
                this.angle += 0.01;
            }

            if(Math.abs(this.angle) < 0.01){
                this.angle = 0;
            }
        }

        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }

    // 定义一个数组来保存尾迹点


    drawTail(ctx, tailPoints) {
        // 若速度为0 尾迹为灰色
        if (this.controls.up || this.controls.down) {
            // 逐个绘制尾迹点 尾迹点的透明度逐渐降低 半径逐渐增大
            for (let i = 0; i < tailPoints.length; i++) {
                const point = tailPoints[i];
                ctx.fillStyle = `rgba(0,255,255,${point.opacity})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 10 - i * 0.1, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    updateTail(tailPoints, newPoint, maxLength) {
        // 添加新的尾迹点
        tailPoints.push(newPoint);

        // 控制尾迹的最大长度
        if (tailPoints.length > maxLength) {
            tailPoints.shift();
        }

        // 逐渐淡化旧的尾迹点
        for (let i = 0; i < tailPoints.length; i++) {
            tailPoints[i].opacity = (i + 1) / tailPoints.length;
        }
    }


    draw(ctx,drawSensor = false){
        // set alpha to 0.2

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
            // ctx.fillStyle = 'red';
            // ctx.font = '20px Arial';
            // ctx.fillText('NITRO', this.x + 20, this.y + 60);

            // 更新和绘制尾迹
            this.updateTail(this.tailPoints, { x: this.polygon[2].x, y: this.polygon[2].y }, 50);
            this.drawTail(ctx, this.tailPoints);

            this.updateTail(this.tailPoints, { x: this.polygon[3].x, y: this.polygon[3].y }, 50);
            this.drawTail(ctx, this.tailPoints);
        }



        if(this.sensors && drawSensor){
            // Debug: 标注车速 及 位置 及 角度
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(`S: ${this.speed.toFixed(2)}`, this.x + 20, this.y);
            ctx.fillText(`P: (${this.x.toFixed(2)}, ${this.y.toFixed(2)})`, this.x + 20, this.y + 20);
            ctx.fillText(`A: ${this.angle.toFixed(2)}`, this.x + 20, this.y + 40);
            if(this.damaged){
                ctx.fillStyle = 'red';
                ctx.font = '20px Arial';
                ctx.fillText(`Damaged`, this.x + 20, this.y + 60);
            }
            this.sensors.draw(ctx);
        }

    }
}
import {lerp} from './utils.js';

export class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 100;
        this.raySpread = Math.PI/4; // 45 degrees

        this.rays = new Array(this.rayCount);
    }

    update(){
        for(let i = 0; i < this.rayCount; i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                i/(this.rayCount - 1)
            );

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };

            // this.rays.push([start, end]);
            this.rays[i] = [start, end];
        }

    }

    draw(ctx){
        if(!this.rays[0]) return;
        for(let i = 0; i < this.rayCount; i++){
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }

}
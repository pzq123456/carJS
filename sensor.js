import {getIntersection, lerp} from './utils.js';

export class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 7
        this.rayLength = 450;
        this.raySpread = Math.PI / 2; // 45 degrees

        this.rays = new Array(this.rayCount).fill(null).map(() => [{x: 0, y: 0}, {x: 0, y: 0}]);
        this.readings = new Array(this.rayCount).fill(0);
    }

    update(roadBorders, traffic){
        this.#castRays();
        for(let i = 0; i < this.rayCount; i++){
            this.readings[i] = this.#getReading(this.rays[i], roadBorders, traffic);
        }


    }

    #getReading(ray, roadBorders, traffic){
        let touchs = [];

        for(let i = 0; i < roadBorders.length; i++){
            const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);
            if(touch) touchs.push(touch);
        }

        for(let i = 0; i < traffic.length; i++){
            const poly = traffic[i].polygon;
            for(let j = 0; j < poly.length; j++){
                const value = getIntersection(ray[0], ray[1], poly[j], poly[(j+1)%poly.length]);
                if(value) touchs.push(value);
            }
        }


        if(touchs.length === 0){
            return null;
        }else{
            const offset = touchs.map(e => e.offset);
            const minOffset = Math.min(...offset);
            return touchs.find(e => e.offset === minOffset);
        }
    }

    #castRays(){
        for(let i = 0; i < this.rayCount; i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                // i/(this.rayCount-1)
                this.rayCount === 1 ? 0.5 : i/(this.rayCount-1) // fix division by zero
            ) + this.car.angle;

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
        // if(!this.rays[0]) return;
        for(let i = 0; i < this.rayCount; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw the intersection point
            if(this.readings[i]){
   

                // Draw the offset
                // ctx.fillStyle = 'black';
                // ctx.font = '10px Arial';
                // ctx.fillText(this.readings[i].offset.toFixed(2), this.readings[i].x + 10, this.readings[i].y - 10);

                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
                ctx.lineTo(this.readings[i].x, this.readings[i].y);
                ctx.stroke();

                ctx.fillStyle = 'orange';
                ctx.beginPath();
                ctx.arc(this.readings[i].x, this.readings[i].y, 2, 0, Math.PI * 2);
                ctx.fill();
            


            }
        }
    }

}
export class Road{
    constructor(x,width,lineCount = 3){
        this.x = x;
        this.width = width;
        this.lineCount = lineCount;

        this.left = this.x - this.width/2;
        this.right = this.x + this.width/2;

        this.top = -100000;
        this.bottom = 100000;

        const topLeft = {x: this.left, y: this.top};
        const topRight = {x: this.right, y: this.top};
        const bottomLeft = {x: this.left, y: this.bottom};
        const bottomRight = {x: this.right, y: this.bottom};

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ];

    }

    getLineCenter(lineIndex){
        const lineWidth = this.width / this.lineCount;
        return this.left + lineWidth * 0.5 + Math.min(this.lineCount, lineIndex) * lineWidth;
    }

    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';

        for(let i = 1; i <= this.lineCount - 1; i++){
            const x = lerp(
                this.left, 
                this.right, 
                i/this.lineCount);
 
            ctx.setLineDash([20, 20]);
 
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });

    }
}

function lerp(A, B, t){
    return A + (B - A) * t;
}
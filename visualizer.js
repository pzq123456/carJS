import { lerp } from "./utils.js";

export class Visualizer{
    static drawNetwork(ctx, network){
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - 2*margin;
        const height = ctx.canvas.height - 2*margin;

        Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);
    }

    static drawLevel(ctx, level, left, top, width, height){
        const right = left + width;
        const bottom = top + height;

        const neuronRadius = 18;
        for(let i = 0; i < level.inputs.length; i++){
            const x = lerp(
                left,
                right,
                level.inputs.length === 1 ? 0.5 : i / (level.inputs.length - 1)
            );
            ctx.beginPath();
            ctx.arc(x, bottom, neuronRadius, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
        }
    }
}
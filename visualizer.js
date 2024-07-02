import { lerp,getRGBA } from "./utils.js";

export class Visualizer{
    static drawNetwork(ctx, network){
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - 2*margin;
        const height = ctx.canvas.height - 2*margin;

        // Visualizer.drawLevel(ctx, network.levels[1], left, top, width, height);

        const levelHeight = height / network.levels.length;
        for(let i = network.levels.length - 1; i >= 0; i--){
            const levelTop = top + lerp(
                    height - levelHeight, 
                    0, 
                    network.levels.length === 1 
                        ? 0.5 
                        : i / (network.levels.length - 1)
                );
            Visualizer.drawLevel(ctx, network.levels[i], 
                left, levelTop, 
                width, levelHeight,
                i===network.levels.length-1
                ? ['🠉','🠈','🠊','🠋'] 
                : []
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height,outputLabels=[]){
        const right = left + width;
        const bottom = top + height;

        const inputs = level.inputs;
        const outputs = level.outputs;
        const weights = level.weights;
        const biases = level.biases;

        const neuronRadius = 18;

        for(let i = 0; i < inputs.length; i++){
            for(let j = 0; j < outputs.length; j++){
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);

                const value = weights[i][j];
                ctx.strokeStyle = getRGBA(value);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        for(let i = 0; i < inputs.length; i++){
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, neuronRadius, 0, 2 * Math.PI);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
            // text the value of the input
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fillText(inputs[i].toFixed(2), x, bottom + neuronRadius + 10);

        }

        for(let i = 0; i < outputs.length; i++){
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, neuronRadius * 0.6, 0, 2 * Math.PI);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();
        }

        for(let i = 0; i < outputs.length; i++){
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = getRGBA(biases[i]);
            ctx.fillText(biases[i].toFixed(2), x, top - neuronRadius - 10);

            ctx.beginPath();
            ctx.arc(x, top, neuronRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        if(outputLabels.length){
            for(let i = 0; i < outputs.length; i++){
                const x = Visualizer.#getNodeX(outputs, i, left, right);
                ctx.font = '25px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.fillText(outputLabels[i], x, top);
                ctx.strokeText(outputLabels[i], x, top);
            }
        }

    }

    static #getNodeX(nodes, index, left, right){
        return lerp(
            left,
            right,
            nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}
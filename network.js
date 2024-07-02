// export class NerualNetwork{
//     constructor(neuronCounts){
//         this.levels = [];
//         for(let i = 0; i < neuronCounts.length - 1; i++){
//             this.levels.push(new Level(neuronCounts[i], neuronCounts[i+1]));
//         }
//     }

//     static feedForward(givenInputs, network){
//         let outputs = Level.feedForward(givenInputs, network.levels[0]);
//         for(let i = 1; i < network.levels.length; i++){
//             outputs = Level.feedForward(outputs, network.levels[i]);
//         }
//         return outputs;
//     }
// }

// class Level{
//     constructor(inputCount, outputCount){
//         this.inputs = new Array(inputCount).fill(0);
//         this.outputs = new Array(outputCount).fill(0);
//         this.biases = new Array(outputCount).fill(0);

//         this.weights = Array(inputCount);
//         for(let i = 0; i < inputCount; i++){
//            this.weights[i] = new Array(outputCount).fill(0);
//         }

//         Level.#randomize(this);
//     }

//     static #randomize(level){
//         for(let i = 0; i < level.weights.length; i++){
//             for(let j = 0; j < level.weights[i].length; j++){
//                 level.weights[i][j] = Math.random() * 2 - 1;
//             }
//             level.biases[i] = Math.random() * 2 - 1;
//         }
//     }

//     static #sigmoid(x){ // 激活函数 将输出值映射到 0-1 之间
//         return 1 / (1 + Math.exp(-x));
//     }

//     // 二值化激活函数
//     static #binaryStep(x, threshold = 0.5){
//         return x > threshold ? 1 : 0;
//     }

//     static feedForward(givenInputs, level){
//         for(let i = 0; i < level.inputs.length; i++){
//             level.inputs[i] = givenInputs[i];
//         }

//         for(let i = 0; i < level.outputs.length; i++){
//             let sum = level.biases[i];
//             for(let j = 0; j < level.inputs.length; j++){
//                 sum += level.weights[i][j] * level.inputs[j];
//             }
//             level.outputs[i] = Level.#binaryStep(Level.#sigmoid(sum));
//         }

//         return level.outputs;
//     }
// }

export class NerualNetwork{
    constructor(neuronCounts){
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs,network){
        let outputs=Level.feedForward(
            givenInputs,network.levels[0]);
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedForward(
                outputs,network.levels[i]);
        }
        return outputs;
    }
}

class Level{
    constructor(inputCount,outputCount){
        this.inputs=new Array(inputCount);
        this.outputs=new Array(outputCount);
        this.biases=new Array(outputCount);

        this.weights=[];
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1;
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;
        }
    }

    static feedForward(givenInputs,level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];
        }

        for(let i=0;i<level.outputs.length;i++){
            let sum=0
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            } 
        }

        return level.outputs;
    }
}
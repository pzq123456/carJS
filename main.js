import { Car } from "./car.js";
import { Road } from "./road.js";
import { Visualizer } from "./visualizer.js";
import { save, remove, load, downLoad, randomLine } from "./utils.js";
import { NerualNetwork } from "./network.js";

// get the button save and remove
const saveButton = document.getElementById('save');
const removeButton = document.getElementById('discard');
const downloadButton = document.getElementById('download');
const loadButton = document.getElementById('loadpre');

const carCanvas = document.getElementById('carCanvas');
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = window.innerHeight;
networkCanvas.width = 600;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');


let road = new Road(carCanvas.width/2, carCanvas.width * 0.9);

let cars = generateCars(100);
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=load("bestBrain");
        if(i!=0){
            NerualNetwork.mutate(cars[i].brain,0.05);
        }
    }
}
let bestCar = cars[0];

let traffic = [
    new Car(road.getLineCenter(randomLine(3)), -1200, 30, 60,"AI",Math.random()*10),
    new Car(road.getLineCenter(randomLine(3)), -600, 30, 60,"AI",Math.random()*10),
    new Car(road.getLineCenter(randomLine(3)), -800, 30, 60,"AI",Math.random()*10),
    new Car(road.getLineCenter(randomLine(3)), -1500, 30, 60,"AI",Math.random()*10),
    new Car(road.getLineCenter(randomLine(3)), -1800, 30, 60,"AI",Math.random()*10),
    new Car(road.getLineCenter(randomLine(3)), -2100, 30, 60,"AI",Math.random()*10),
    new Car(road.getLineCenter(randomLine(3)), -2400, 30, 60,"AI",Math.random()*10),
    new Car(road.getLineCenter(randomLine(3)), -2700, 30, 60,"AI",Math.random()*10),
    new Car(road.getLineCenter(randomLine(3)), -3000, 30, 60,"AI",Math.random()*10),
    new Car(road.getLineCenter(randomLine(3)), -3300, 30, 60,"AI",Math.random()*10),
];

function updateTraffic(bestCar,radius,num = 5){
    // 查询缓存将 bestCar 的 brain 赋予 traffic 中的车辆
    if(localStorage.getItem("bestBrain")){
        for(let i=0;i<traffic.length;i++){
            traffic[i].brain=load("bestBrain");
        }
    }
    // 使用绝对值是因为 y 轴是向下的
    traffic = traffic.filter(t => Math.abs(t.y - bestCar.y) < radius);

    while(traffic.length < num){
        traffic.push(new Car(road.getLineCenter(randomLine(3)), bestCar.y - radius - Math.random()*500, 30, 50,"AI", 10));
    }

}

// add event listener to the button
saveButton.addEventListener('click', () => {
    save("bestBrain",bestCar.brain);
});

removeButton.addEventListener('click', () => {
    remove("bestBrain");
})

downloadButton.addEventListener('click', () => {
    downLoad("bestBrain",bestCar.brain);
})

loadButton.addEventListener('click', () => {
    loadpre();
});

// game loop
gameLoop();

function generateCars(N){
    const cars = [];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLineCenter(1), 0, 30, 60,"AI"));
    }
    return cars;
}

function update(){
    traffic.forEach(t => {
        t.update(road.borders,[bestCar]);
    });

    cars = cars.filter(c => !c.damaged);

    cars.forEach(c => {
        c.update(road.borders,traffic);
    });
    bestCar = cars.reduce((a,b) => a.y < b.y ? a : b);
    updateTraffic(bestCar,900);
}

function rander(){
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    carCtx.save();
    carCtx.translate(0, -bestCar.y + window.innerHeight*0.7);

    road.draw(carCtx);
    traffic.forEach(t => {
        t.draw(carCtx);
    });

    carCtx.globalAlpha = 0.2;

    cars.forEach(c => {
        c.draw(carCtx, c === bestCar);
    });

    carCtx.globalAlpha = 1;

    carCtx.restore();

    Visualizer.drawNetwork(networkCtx, bestCar.brain);
}

function gameLoop(){
    update();
    rander();
    requestAnimationFrame(gameLoop);
}

function loadpre(){
    // 若 localStorage 为空则 加载预训练好的神经网络 写入到 localStorage 中
    // 加载地址为 /bestBrain.json
    if(!localStorage.getItem("bestBrain")){
        fetch("bestBrain.json")
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("bestBrain",JSON.stringify(data));
            });
    }else{
        console.log("bestBrain is already in localStorage, you can delete it by remove button");
    }
}

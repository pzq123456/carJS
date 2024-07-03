import { Car } from "./car.js";
import { Road } from "./road.js";
import { Visualizer } from "./visualizer.js";
import { save,remove,load } from "./utils.js";
import { NerualNetwork } from "./network.js";

// get the button save and remove
const saveButton = document.getElementById('save');
const removeButton = document.getElementById('discard');



const carCanvas = document.getElementById('carCanvas');
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = window.innerHeight;
networkCanvas.width = 400;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');


let road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
// create car
// let car = new Car(road.getLineCenter(0), 100, 30, 60,"KEYS");
const cars = generateCars(50);
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=load("bestBrain");
        if(i!=0){
            NerualNetwork.mutate(cars[i].brain,0.1);
        }
    }
}
let bestCar = cars[0];
const traffic = [
    new Car(road.getLineCenter(0), -200, 30, 60,"DUMMY",Math.random()*10),
    new Car(road.getLineCenter(1), -600, 30, 60,"DUMMY",Math.random()*10),
    new Car(road.getLineCenter(2), 300, 30, 60,"DUMMY",Math.random()*10),
    new Car(road.getLineCenter(2), -1500, 30, 60,"DUMMY",Math.random()*10),
    new Car(road.getLineCenter(2), -1800, 30, 60,"DUMMY",Math.random()*10),
];


// add event listener to the button
saveButton.addEventListener('click', () => {
    save("bestBrain",bestCar.brain);
});

removeButton.addEventListener('click', () => {
    remove("bestBrain");
});


// game loop
gameLoop();

function generateCars(N){
    const cars = [];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLineCenter(1), 0, 30, 60,"AI",Math.random()*10));
    }
    return cars;
}

function gameLoop(){
    traffic.forEach(t => {
        t.update(road.borders,[]);
    });

    cars.forEach(c => {
        c.update(road.borders,traffic);
    });
    bestCar = cars.reduce((a,b) => a.y < b.y ? a : b);

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
    requestAnimationFrame(gameLoop);
}
import { Car } from "./car.js";
import { Road } from "./road.js";
import { Visualizer } from "./visualizer.js";

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
let car = new Car(road.getLineCenter(0), 100, 30, 60,"KEYS");
car.draw(carCtx);

const traffic = [
    new Car(road.getLineCenter(0), 0, 30, 60,"DUMMY",Math.random()*10),
    new Car(road.getLineCenter(1), 0, 30, 60,"DUMMY",Math.random()*10),
    new Car(road.getLineCenter(2), 0, 30, 60,"DUMMY",Math.random()*10),
];

// game loop
gameLoop();
function gameLoop(){
    traffic.forEach(t => {
        t.update(road.borders,[]);
    });
    car.update(road.borders,traffic);
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    carCtx.save();
    carCtx.translate(0, -car.y + window.innerHeight*0.7);

    road.draw(carCtx);
    traffic.forEach(t => {
        t.draw(carCtx);
    });
    car.draw(carCtx);

    carCtx.restore();
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(gameLoop);
}
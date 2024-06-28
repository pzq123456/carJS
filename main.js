import { Car } from "./car.js";
import { Road } from "./road.js";

const canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext('2d');
let road = new Road(canvas.width/2, canvas.width * 0.9);
// create car
let car = new Car(road.getLineCenter(0), 900, 30, 60, 'black');
car.draw(ctx);

// game loop
gameLoop();
function gameLoop(){
    car.update(road.borders);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(0, -car.y + window.innerHeight*0.7);

    road.draw(ctx);

    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(gameLoop);
}
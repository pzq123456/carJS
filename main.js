import { Car } from "./car.js";

const canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext('2d');

// create car
let car = new Car(100, 900, 30, 60, 'gray');
car.draw(ctx);

// game loop
gameLoop();
function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    car.update();
    car.draw(ctx);
    requestAnimationFrame(gameLoop);
}
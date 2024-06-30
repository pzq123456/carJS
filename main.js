import { Car } from "./car.js";
import { Road } from "./road.js";

const canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight;
canvas.width = 400;

const ctx = canvas.getContext('2d');
let road = new Road(canvas.width/2, canvas.width * 0.9);
// create car
let car = new Car(road.getLineCenter(0), 0, 30, 60,"KEYS");
car.draw(ctx);

const traffic = [
    new Car(road.getLineCenter(1), 80, 30, 60,"DUMMY",Math.random()*10),
];

// game loop
gameLoop();
function gameLoop(){
    traffic.forEach(t => {
        t.update(road.borders,[]);
    });
    car.update(road.borders,traffic);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(0, -car.y + window.innerHeight*0.7);

    road.draw(ctx);
    traffic.forEach(t => {
        t.draw(ctx);
    });
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(gameLoop);
}
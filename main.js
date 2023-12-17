import { Engine, Render, Runner, Body, Bodies, World, Events, Mouse, MouseConstraint } from "matter-js";
import { Ball } from "./class";

const windowWidth = 1200;
const windowHeight = 850;

let BALL = Ball
let mouseStartPos, mouseEndPos;

let powerLine, power;

let userBall;

const engine = Engine.create();
const render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false,
        background: "#F7F4C8",
        width: windowWidth,
        height: windowHeight,
    }
});

const world = engine.world;

Render.run(render);
Runner.run(engine);

function addBall() {
    console.log(power)
    userBall = new BALL();

    const body = Bodies.circle(300, 50, userBall.radius, {
        isSleeping: true,
        render: {
            fillStyle: "red",
        },
        restitution: 0.2,
    });

    World.add(world, body)
}

window.onmousedown = (event) => {
    mouseStartPos = { x: event.clientX, y: event.clientY };
}

window.onmousemove = (event) => {
    if (mouseStartPos) {
        if (powerLine) {
            World.remove(world, powerLine);
        }
        mouseEndPos = { x: event.clientX, y: event.clientY };

        power = Math.sqrt(Math.pow(mouseEndPos.x - mouseStartPos.x, 2) + Math.pow(mouseEndPos.y - mouseStartPos.y, 2));
        const height = 3;

        var color;

        switch(power) {
            case power < 50:
                color = "green";
                break;
            case power < 200:
                color = "yellow";
                break;
            case power < 450:
                color = "orange";
                break;
            default:
                color = "red";
        }
        console.log(color)
        console.log(power)

        const centerX = (mouseEndPos.x + mouseStartPos.x) / 2;
        const centerY = (mouseEndPos.y + mouseStartPos.y) / 2;

        const angle = Math.atan2(mouseEndPos.y - mouseStartPos.y, mouseEndPos.x - mouseStartPos.x);

        powerLine = Bodies.rectangle(centerX, centerY, power, height, {
            isStatic: true,
            render: {
                fillStyle: color,
            },
            angle: angle,
        });
        World.add(world, [powerLine]);
    }
}

window.onmouseup = (event) => {
    mouseEndPos = { x: event.clientX, y: event.clientY };

    if (powerLine) {
        World.remove(world, powerLine);
    }

    mouseStartPos = null;
    addBall()
}

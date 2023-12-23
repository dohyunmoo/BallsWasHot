import { Engine, Render, Runner, Body, Bodies, World, Events, Mouse, MouseConstraint } from "matter-js";
import { Ball } from "./class";

const windowWidth = 1200;
const windowHeight = 850;

let mouseStartPos = {x: -1, y: -1};
let mouseEndPos = {x: -1, y: -1};
let mouseDownTime = 0;

let powerLine, power;

let userBall = new Ball();
let objBall;
// let user_move;

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

function checkBall() {
    if (objBall) {
        if (objBall.x < 0 || objBall.x > windowWidth || objBall.y < 0 || objBall.y > windowHeight) {
            World.remove(world, objBall);
            console.log("removed")
        } else {
            requestAnimationFrame(checkBall);
        }
    }
}

window.onmousedown = (event) => {
    mouseStartPos = { x: event.clientX, y: event.clientY };
    mouseDownTime = Date.now();

    if (mouseStartPos.x != -1 && mouseStartPos.y != -1) {
        setTimeout(() => {
            if (Date.now() - mouseDownTime >= 3000) {
                console.log("WOW")
            }
            mouseStartPos = {x: -1, y: -1};
            World.remove(world, powerLine)
        }, 3000);
    }

    objBall = Bodies.circle(mouseStartPos.x, mouseStartPos.y, userBall.radius, {
        isSleeping: false,
        render: {
            fillStyle: "red",
        },
        restitution: 0.2,
    });
}

window.onmousemove = (event) => {
    if (mouseStartPos.x != -1 && mouseStartPos.y != -1) {
        if (powerLine) {
            World.remove(world, powerLine);
        }
        mouseEndPos = { x: event.clientX, y: event.clientY };

        power = Math.sqrt(Math.pow(mouseEndPos.x - mouseStartPos.x, 2) + Math.pow(mouseEndPos.y - mouseStartPos.y, 2));
        const height = 3;

        var color;

        switch(true) {
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
            isSensor: true,
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

        World.add(world, objBall)
        const forceVector = { x: -(mouseEndPos.x - mouseStartPos.x) / 3000, y: -(mouseEndPos.y - mouseStartPos.y) / 3000 };
        Body.applyForce(objBall, { x: objBall.position.x, y: objBall.position.y }, forceVector);
    }

    mouseStartPos = {x: -1, y: -1};
    mouseEndPos = {x: -1, y: -1};
    // user_move = false
}

// checkBall()

function keydown(event) {
    if (event.keyCode === 32) {
        console.log('here')
    }
}

document.addEventListener('keydown', keydown, false);


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();


let squareCenter = null;
let squareX = null;
let squareY = null;
let size = 5;
let counter = 0;
let points = 0;
const canvasWidth = 800;
const canvasHeight = 600;
let isGameOver = false;
let timeLeft = 30;
let mouseX = null;
let mouseY = null;


function decreaseTimer() {
    setTimeout(() => {
        timeLeft--;
        if (timeLeft > 0)
            decreaseTimer();
        else
            isGameOver = true;
    }, 1000);
}
decreaseTimer();

function setNewSquareCoords() {
    squareX = Math.floor(Math.random() * 600 + 100); // 100-700
    squareY = Math.floor(Math.random() * 400 + 100); // 100-500
}

function drawSquare() {
    ctx.fillStyle = 'red';
    ctx.fillRect(squareX, squareY, size, size);
}

function drawPoints() {
    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText(`Points ${points}`, 10, 30);
}

function drawTimeLeft() {
    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText(`Time Left: ${timeLeft}`, canvasWidth - 200, 30);
}

function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = "50px Arial";
    ctx.fillText('Game Over!!', 250, 300);
}

function getSquareSpeed() {
    let runSpeed = 1;
    if (timeLeft < 20)
        runSpeed = 2;
    else if (timeLeft < 10)
        runSpeed = 3;
    else if (timeLeft < 5)
        runSpeed = 4;
    return runSpeed;
}

function squareRunFromMouse() {
    const runSpeed = getSquareSpeed();

    if (mouseX > squareX) {
        squareX -= runSpeed;
    }

    if (mouseX < squareX) {
        squareX += runSpeed;
    }

    if (mouseY > squareY) {
        squareY -= runSpeed;
    }

    if (mouseY < squareY) {
        squareY += runSpeed;
    }
}

function ensureSquareInCanvas() {
    if (squareX < 0)
        squareX = 0;

    if (squareY < 0)
        squareY = 0;

    if (squareX + size > canvasWidth)
        squareX = canvasWidth - size;

    if (squareY + size > canvasHeight)
        squareY = canvasHeight - size;
}

(function animationLoop(){
    if (!isGameOver)
        window.requestAnimationFrame(animationLoop);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (squareX === null)
        setNewSquareCoords();

    drawPoints();
    drawTimeLeft();
    drawSquare();
    if (isGameOver)
        drawGameOver();

    counter++;
    if ((counter % 3) === 0)
        size++;

    if ((counter % 2) === 0)
        squareRunFromMouse();

    ensureSquareInCanvas();
})();


canvas.addEventListener('mousedown', e => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xMatches = (x > squareX) && (x < squareX + size);
    const yMatches = (y > squareY) && (y < squareY + size);
    if (xMatches && yMatches) {
        points += Math.max(105 - size, 0);
        size = 5;
        squareX = null;
        squareY = null;
    } else {
        isGameOver = true;
    }
});

canvas.addEventListener('mousemove', e => {
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

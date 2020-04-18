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
let randomX = null;
let randomY = null;
let size = 5;
let counter = 0;
let points = 0;
const canvasWidth = 800;
const canvasHeight = 600;
let gameOver = false;
let roundTime = 30;

function decreaseTimer() {
    setTimeout(() => {
        roundTime--;
        if (roundTime > 0)
            decreaseTimer();
        else
            gameOver = true;
    }, 1000);
}
decreaseTimer();

(function animationLoop(){
    if (!gameOver)
        window.requestAnimationFrame(animationLoop);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText(`Points ${points}`, 10, 30);

    ctx.fillText(`Time Left: ${roundTime}`, canvasWidth - 200, 30);

    if (randomX === null) {
        randomX = Math.floor(Math.random() * 600 + 100); // 100-700
        randomY = Math.floor(Math.random() * 400 + 100); // 100-500

    }

    ctx.fillStyle = 'red';
    ctx.fillRect(randomX, randomY, size, size);

    counter++;

    if ((counter % 3) === 0)
        size++;
})();


canvas.addEventListener('mousedown', e => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xMatches = (x > randomX) && (x < randomX + size);
    const yMatches = (y > randomY) && (y < randomY + size);
    if (xMatches && yMatches) {
        points += Math.max(105 - size, 0);
        size = 5;
        randomX = null;
        randomY = null;
    } else {
        gameOver = true;
    }
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();

const canvasWidth = 800;
const canvasHeight = 600;
let damageMultiplier = 1;
let squareCenter = null;
let squareX = null;
let squareY = null;
let size = 5;
let counter = 0;
let points = 0;
let isGameOver = false;
let timeLeft = 30;
let mouseX = canvasWidth / 2;
let mouseY = canvasHeight / 2;
let deathSquareX = 0;
let deathSquareY = 0;
const deathSquareSize = 5;


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

function drawDeathSquare() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(deathSquareX, deathSquareY, deathSquareSize, deathSquareSize);
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

function deathSquareChaseMouse() {
    const runSpeed = 1;

    if (mouseX > deathSquareX + 2) {
        deathSquareX += runSpeed;
    }

    if (mouseX < deathSquareX + 2 ) {
        deathSquareX -= runSpeed;
    }

    if (mouseY > deathSquareY + 2) {
        deathSquareY += runSpeed;
    }

    if (mouseY < deathSquareY + 2) {
        deathSquareY -= runSpeed;
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


//////////////////////MARK'S CODE//////////////////////////////
function drawRectangle(color,dimensions){
  ctx.fillStyle = color;
  ctx.fillRect(...dimensions);

}

function Flash(color,x,y,w,h){
	this.dim = [x,y,w,h];
	this.color = color;
	this.alpha = 0;
	this.draw = ()=>{
	  if(this.alpha <=0) return
	  ctx.save()
	  ctx.globalAlpha = this.alpha;
	  drawRectangle(this.color,this.dim)
	  ctx.restore()
	}
   	this.update = () =>{
	  if (this.alpha > 0)
	  this.alpha -= .2
	}
}

var screenFlash = new Flash('magenta',0,0,canvasWidth,canvasHeight)

function takeDamage(){
  screenFlash.alpha = 1;
  timeLeft = Math.max(timeLeft - damageMultiplier, 0);
  damageMultiplier = Math.min(damageMultiplier+1,3)
  if(timeLeft == 0) isGameOver = true
}

function checkDeathSquareCollision(){

    const xMatches = (mouseX > deathSquareX) && (mouseX < deathSquareX + deathSquareSize);
    const yMatches = (mouseY > deathSquareY) && (mouseY < deathSquareY + deathSquareSize);
    if (xMatches && yMatches)
        takeDamage();
}


////////////////////////////////////////////////////////////



(function animationLoop(){
    if (!isGameOver)
        window.requestAnimationFrame(animationLoop);
    	
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

     screenFlash.draw();
    screenFlash.update();

    if (squareX === null)
        setNewSquareCoords();


    if(isGameOver){
	drawGameOver();
	return;
    }
   
  
    drawPoints();
    drawTimeLeft();
    drawSquare();
    drawDeathSquare();


    counter++;
    if ((counter % 3) === 0)
        size++;

    if ((counter % 2) === 0)
        squareRunFromMouse();

    deathSquareChaseMouse();
    checkDeathSquareCollision();	
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
        takeDamage();
    }
});

canvas.addEventListener('mousemove', e => {
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

});

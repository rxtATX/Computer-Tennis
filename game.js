//Global variables
var canvas;
var canvasContext;
//Coordinates and speed for the ball.
var ballX = 400;
var ballY = 300;
var ballSpeedX = 5;
var ballSpeedY = 2;
//Coordinates player paddle
var paddleOneY = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
//Coordinates for computer paddle
var paddleTwoY = 250;
//Fires when content is loaded.
var playerScore = 0;
var computerScore = 0;
const WINNINGSCORE = 7;

var showingWinScreen = false;
window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");
	//Frames per second and reiterating function calls.
	var FPS = 50;
	setInterval(function() {
		drawGame();
		gameMovement();
	}, 1000/FPS);
	//Establish movement with mouse.
	canvas.addEventListener("mousemove", handleMouseMove);
	canvas.addEventListener("mousedown", handleMouseClick);
};
//Mouse event listeners
function handleMouseClick(evt) {
	if (showingWinScreen) {
		playerScore = 0;
		computerScore = 0;
		//Resets to new game.
		showingWinScreen = false;
	}
}
function handleMouseMove(evt) {
	var mousePosition = mousePos(evt);
	paddleOneY = mousePosition.y - (PADDLE_HEIGHT/2);
}
//Create a drawing functions with parameters for all units.
function colorIn(leftX, topY, width, height, color) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(leftX, topY, width, height);
}
function colorCircle(centerX, centerY, radius, color) {
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}
//Establish visual for game board.
function drawGame() {
	//Colors game board.
	colorIn(0, 0, canvas.width, canvas.height, "black");
	//Will keep the black box and prevent other elements from showing during game over page.
	if (showingWinScreen) {
		canvasContext.fillStyle = "white";
		if (playerScore === WINNINGSCORE) {
			canvasContext.fillText("You win!", 380, 200);
		} else if (computerScore === WINNINGSCORE) {
			canvasContext.fillText("The computer wins!", 345, 200);
		}
		canvasContext.fillText("Click to Continue", 350, 500);
		return;
	}
	//Paints net.
	for (var i = 0; i < canvas.height; i += 40) {
		colorIn(canvas.width/2-1, i, 2, 20, "white");
	}
	//Both paddles
	colorIn(0, paddleOneY, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
	colorIn(canvas.width - PADDLE_THICKNESS, paddleTwoY, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
	//Ball
	colorCircle(ballX, ballY, 8, "white");
	//Aligns score display.
	canvasContext.fillText(playerScore, 100, 100);
	canvasContext.fillText(computerScore, canvas.width - 100, 100);
}
//Create computer AI for paddle control
function computerMovement() {
	var paddleTwoYCenter = paddleTwoY + (PADDLE_HEIGHT/2);
	if (paddleTwoYCenter < (ballY - 35)) {
		paddleTwoY += 6;
	} else if (paddleTwoYCenter > (ballY + 35)) {
		paddleTwoY -= 6;
	} 
}
//Generate movement of player elements.
function gameMovement() {
	//Stops running if game over.
	if (showingWinScreen) {
		return;
	}
	computerMovement();
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	//For bouncing off walls.
	if (ballY > canvas.height || ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	//For bouncing off paddles.
	//Player paddle
	if (ballX <= 0) {
		if (ballY > paddleOneY && 
			ballY < paddleOneY + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddleOneY + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.3;
		} else {
			//Generate score BEFORE reset
			computerScore++;
			ballReset();
		}
	}
	//Opponent paddle
	if (ballX >= canvas.width) {
		if (ballY > paddleTwoY &&
			ballY < paddleTwoY + PADDLE_HEIGHT) {
			ballSpeedX = - ballSpeedX;
			var deltaY = ballY - (paddleTwoY + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.3;
		} else {
			//Generate score BEFORE reset
			playerScore++;
			ballReset();
		}
	}
}
//Win conditions declared; creates game over screen if met. Otherwise, sets ball to center position and restarts its movement.
function ballReset() {
	if (playerScore === WINNINGSCORE || computerScore === WINNINGSCORE) {
		showingWinScreen = true;
	}
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}
//Reads player's mouse coordinates and centers to middle of player paddle via y position.
function mousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}